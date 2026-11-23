package easmdrp

import (
	"fmt"
	"strings"
	"sync"

	"github.com/robfig/cron/v3"
)

// ScheduledJob defines one periodic EASM or DRP background job.
type ScheduledJob struct {
	Name string
	Spec string
	Run  func()
}

// ValidateCron validates a standard 5-field cron expression.
func ValidateCron(expr string) error {
	trimmed := strings.TrimSpace(expr)
	if trimmed == "" {
		return fmt.Errorf("cron 表达式不能为空")
	}
	if _, err := cron.ParseStandard(trimmed); err != nil {
		return fmt.Errorf("无效的 cron 表达式 %q: %w", trimmed, err)
	}
	return nil
}

// Scheduler manages periodic background EASM re-probes and DRP rule syncs.
type Scheduler struct {
	mu      sync.Mutex
	runner  *cron.Cron
	started bool
	entries []cron.EntryID
}

func NewScheduler() *Scheduler {
	return &Scheduler{
		runner: cron.New(),
	}
}

func (s *Scheduler) Start() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.started {
		return
	}
	s.runner.Start()
	s.started = true
}

func (s *Scheduler) Stop() {
	s.mu.Lock()
	if !s.started {
		s.mu.Unlock()
		return
	}
	ctx := s.runner.Stop()
	s.started = false
	s.mu.Unlock()
	<-ctx.Done()
}

// Reload replaces all currently registered jobs with the provided schedule set.
func (s *Scheduler) Reload(jobs []ScheduledJob) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, id := range s.entries {
		s.runner.Remove(id)
	}
	s.entries = s.entries[:0]

	var firstErr error
	for _, job := range jobs {
		spec := strings.TrimSpace(job.Spec)
		if spec == "" || job.Run == nil {
			continue
		}
		fn := job.Run
		id, err := s.runner.AddFunc(spec, fn)
		if err != nil {
			if firstErr == nil {
				firstErr = fmt.Errorf("注册定时任务 %s (%s) 失败: %w", job.Name, spec, err)
			}
			continue
		}
		s.entries = append(s.entries, id)
	}
	return len(s.entries), firstErr
}

// ActiveJobCount returns the number of active cron entries currently scheduled.
func (s *Scheduler) ActiveJobCount() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.entries)
}
