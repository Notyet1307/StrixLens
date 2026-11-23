(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SILensCossMotion = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var TAB_CONTAINER_CONFIGS = [
    { container: '.vulnerability-view-switch', active: '.vuln-view-btn.active, .active' },
    { container: '.projects-tabs', active: '.projects-tab.active, [aria-selected="true"].projects-tab, .active' },
    { container: '.swarm-segmented', active: '.swarm-seg-btn.active, .active' },
    { container: '.swarm-inspector-tabs', active: '.swarm-tab-btn.active, .active' },
    { container: '.asset-period-switch', active: '.asset-period-btn.active, .active' },
    { container: '#page-settings .settings-nav', active: '.settings-nav-item.active, .active', vertical: true }
  ];

  var STAGGER_SELECTORS = [
    '.dashboard-kpi-grid > .dashboard-kpi-card',
    '.dashboard-workspace-grid > section',
    '.dashboard-workspace-grid > .dashboard-section',
    '.asset-kpi-grid > *',
    '.projects-grid > *',
    '.swarm-stats-row > *',
    '.settings-section.active > .settings-card'
  ];

  function prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return true;
    }
    try {
      return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return false;
    }
  }

  function computeGliderRect(container, activeEl) {
    if (!container || !activeEl) return null;
    var w = activeEl.offsetWidth || 0;
    var h = activeEl.offsetHeight || 0;
    if (w <= 0 || h <= 0) return null;
    return {
      x: activeEl.offsetLeft || 0,
      y: activeEl.offsetTop || 0,
      width: w,
      height: h
    };
  }

  function ensureGliderElement(container) {
    if (!container || typeof document === 'undefined') return null;
    var children = container.children || [];
    for (var i = 0; i < children.length; i++) {
      if (children[i].classList && children[i].classList.contains('coss-tab-glider')) {
        return children[i];
      }
    }
    var glider = document.createElement('span');
    glider.className = 'coss-tab-glider';
    glider.setAttribute('aria-hidden', 'true');
    if (container.firstChild) {
      container.insertBefore(glider, container.firstChild);
    } else {
      container.appendChild(glider);
    }
    return glider;
  }

  function syncContainerGlider(container, activeSelector) {
    if (!container || typeof container.querySelector !== 'function') return;
    var activeEl = container.querySelector(activeSelector);
    var glider = ensureGliderElement(container);
    if (!glider) return;

    var rect = computeGliderRect(container, activeEl);
    if (!rect) {
      glider.style.opacity = '0';
      return;
    }
    container.classList.add('coss-glider-ready');
    glider.style.width = rect.width + 'px';
    glider.style.height = rect.height + 'px';
    glider.style.transform = 'translate3d(' + rect.x + 'px, ' + rect.y + 'px, 0)';
    glider.style.opacity = '1';
  }

  function syncAllGliders() {
    if (typeof document === 'undefined') return;
    for (var i = 0; i < TAB_CONTAINER_CONFIGS.length; i++) {
      var cfg = TAB_CONTAINER_CONFIGS[i];
      var nodes = document.querySelectorAll(cfg.container);
      for (var j = 0; j < nodes.length; j++) {
        syncContainerGlider(nodes[j], cfg.active);
      }
    }
  }

  function scheduleGliderSync() {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () {
        syncAllGliders();
      });
    } else {
      syncAllGliders();
    }
  }

  function applyStaggerAndEntrance(pageEl) {
    if (!pageEl || prefersReducedMotion()) return;
    pageEl.classList.remove('coss-page-in');
    void pageEl.offsetWidth;
    pageEl.classList.add('coss-page-in');

    var combinedSelector = STAGGER_SELECTORS.join(', ');
    var items = pageEl.querySelectorAll(combinedSelector);
    var maxItems = Math.min(items.length, 10);
    for (var i = 0; i < maxItems; i++) {
      var item = items[i];
      item.style.setProperty('--coss-stagger-i', String(i));
      item.classList.remove('coss-card-stagger');
      void item.offsetWidth;
      item.classList.add('coss-card-stagger');
    }
  }

  function setupChatMessageReveal() {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
    var container = document.getElementById('chat-messages');
    if (!container) return;

    var lastBatchTime = 0;
    var observer = new MutationObserver(function (mutations) {
      if (prefersReducedMotion()) return;
      var now = Date.now();
      var added = [];
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type !== 'childList' || !m.addedNodes) continue;
        for (var j = 0; j < m.addedNodes.length; j++) {
          var node = m.addedNodes[j];
          if (node && node.nodeType === 1 && node.classList && node.classList.contains('message')) {
            added.push(node);
          }
        }
      }
      // Bulk conversation hydration (>4 messages at once) gets subtle reveal only on last item
      if (added.length === 0) return;
      if (added.length > 4 && now - lastBatchTime > 250) {
        lastBatchTime = now;
        var tail = added[added.length - 1];
        tail.classList.add('coss-msg-in');
        return;
      }
      lastBatchTime = now;
      for (var k = 0; k < added.length; k++) {
        added[k].classList.add('coss-msg-in');
      }
    });

    observer.observe(container, { childList: true });
  }

  function setupGliderObservers() {
    if (typeof document === 'undefined') return;

    document.addEventListener('click', function (e) {
      var target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      for (var i = 0; i < TAB_CONTAINER_CONFIGS.length; i++) {
        if (target.closest(TAB_CONTAINER_CONFIGS[i].container)) {
          scheduleGliderSync();
          setTimeout(syncAllGliders, 60);
          break;
        }
      }
    }, true);

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        scheduleGliderSync();
      });
      for (var i = 0; i < TAB_CONTAINER_CONFIGS.length; i++) {
        var els = document.querySelectorAll(TAB_CONTAINER_CONFIGS[i].container);
        for (var j = 0; j < els.length; j++) {
          ro.observe(els[j]);
        }
      }
    }

    if (typeof MutationObserver !== 'undefined') {
      var mainContent = document.querySelector('.main-content') || document.body;
      var mo = new MutationObserver(function () {
        scheduleGliderSync();
      });
      mo.observe(mainContent, {
        attributes: true,
        attributeFilter: ['class', 'aria-selected'],
        subtree: true,
        childList: true
      });
    }
  }

  function initCossMotion() {
    if (typeof document === 'undefined') return;
    if (document.documentElement.dataset.cossMotionInit === '1') return;
    document.documentElement.dataset.cossMotionInit = '1';

    document.addEventListener('si-lens-page-changed', function (ev) {
      var pageName = ev && ev.detail && ev.detail.page;
      var pageEl = pageName ? document.getElementById('page-' + pageName) : document.querySelector('.page.active');
      if (pageEl) {
        applyStaggerAndEntrance(pageEl);
      }
      scheduleGliderSync();
      setTimeout(syncAllGliders, 80);
    });

    window.addEventListener('resize', scheduleGliderSync, { passive: true });
    setupGliderObservers();
    setupChatMessageReveal();

    var initialPage = document.querySelector('.page.active');
    if (initialPage) {
      applyStaggerAndEntrance(initialPage);
    }
    scheduleGliderSync();
    setTimeout(syncAllGliders, 120);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCossMotion);
    } else {
      initCossMotion();
    }
  }

  return {
    TAB_CONTAINER_CONFIGS: TAB_CONTAINER_CONFIGS,
    computeGliderRect: computeGliderRect,
    syncAllGliders: syncAllGliders,
    initCossMotion: initCossMotion
  };
});
