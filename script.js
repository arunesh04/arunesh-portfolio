/**
 * Arunesh J - Portfolio Interactive Engine
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initNavigation();
  initCounters();
  initSkillsFilter();
  initHelmDoctorDemo();
  initClipboardButtons();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved preference or default to 'dark'
  const savedTheme = localStorage.getItem('arunesh_theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  root.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('arunesh_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* ==========================================================================
   2. Scroll Progress & Scroll Spy
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // 1. Progress Bar calculation
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = `${scrolled}%`;
    }

    // 2. Active Section Spy
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. Mobile Navigation & Smooth Scroll
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   4. Animated Metric Number Counters
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1500; // ms
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.ceil(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   5. Filterable Skills Matrix
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Helm Doctor Interactive Live Engine Demo
   ========================================================================== */
const HELM_PRESETS = {
  'production-grade': {
    name: 'E-Commerce Production Chart',
    badge: 'Preset: Production Grade (A+)',
    yaml: `# Chart: zop-ecommerce-service (v2.4.0)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-api
  namespace: production
  labels:
    app.kubernetes.io/name: ecommerce-api
    app.kubernetes.io/part-of: zopdev-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ecommerce-api
  template:
    metadata:
      labels:
        app: ecommerce-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        fsGroup: 20001
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: api
        image: "ghcr.io/zopdev/ecommerce-api:v2.4.0"
        imagePullPolicy: IfNotPresent
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
        resources:
          limits:
            cpu: "1000m"
            memory: "512Mi"
          requests:
            cpu: "250m"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5`,
    grade: 'A+',
    gradeClass: '',
    gradeTitle: 'Production Ready',
    gradeDesc: 'Chart satisfies 96% of enterprise Kubernetes reliability, security and upgradeability standards.',
    passedChecks: '48 / 50 Checks Passed',
    scanTime: '12ms',
    securityScore: 98,
    reliabilityScore: 96,
    upgradeScore: 100,
    findings: [
      { type: 'pass', title: 'SecurityContext Compliant', desc: 'Container drops ALL capabilities and runs as non-root user (UID 10001).' },
      { type: 'pass', title: 'Health Probes Configured', desc: 'Liveness and Readiness probes properly specified with graceful delay margins.' },
      { type: 'pass', title: 'Resource Limits & Requests', desc: 'Guaranteed QoS with defined memory/CPU bounds preventing node memory exhaustion.' },
      { type: 'pass', title: 'Values JSON Schema Valid', desc: 'values.schema.json matches all parameterized options for single-click UI deployment.' }
    ]
  },
  'vulnerable-chart': {
    name: 'Legacy Microservice',
    badge: 'Preset: Vulnerable Chart (C-)',
    yaml: `# Chart: legacy-billing-worker (v1.0.0)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: billing-worker
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: billing-worker
    spec:
      # MISSING: Pod SecurityContext
      containers:
      - name: worker
        image: "docker.io/legacy/billing:latest" # Anti-pattern: ':latest' tag
        imagePullPolicy: Always
        # MISSING: SecurityContext allowPrivilegeEscalation: false
        # MISSING: readOnlyRootFilesystem
        # MISSING: CPU/Memory Limits & Requests
        # MISSING: Readiness & Liveness Probes
        ports:
        - containerPort: 9000`,
    grade: 'C-',
    gradeClass: 'grade-danger',
    gradeTitle: 'High Risk - Fails Policy',
    gradeDesc: 'Critical security vulnerabilities and missing availability safeguards detected.',
    passedChecks: '28 / 50 Checks Passed',
    scanTime: '18ms',
    securityScore: 42,
    reliabilityScore: 50,
    upgradeScore: 60,
    findings: [
      { type: 'fail', title: 'Critical: Root Execution Permitted', desc: 'Container runs as UID 0 (root) without seccomp profile or capability dropping.' },
      { type: 'fail', title: 'Anti-Pattern: mutable :latest Image Tag', desc: 'Using :latest prevents deterministic rollback and reproducible deployments.' },
      { type: 'warn', title: 'Missing Probes', desc: 'No livenessProbe or readinessProbe defined; traffic will be routed to unready pods.' },
      { type: 'warn', title: 'Unbounded Resources', desc: 'No CPU or Memory limits defined; risk of cluster-wide noisy neighbor OOM crash.' }
    ]
  },
  'oci-optimized': {
    name: 'Cloud-Native Ingress & Database Chart (OCI/GCP)',
    badge: 'Preset: OCI Multi-Cloud Parity (A)',
    yaml: `# Chart: zop-oci-platform-ingress (v1.8.2)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloud-gateway
  namespace: ingress-system
  annotations:
    oci.oraclecloud.com/load-balancer-type: "nlb"
    cloud.zop.dev/provider: "oci"
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  template:
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values: ["cloud-gateway"]
              topologyKey: "topology.kubernetes.io/zone"
      containers:
      - name: gateway
        image: "cr.oraclecloud.com/zop/gateway:v1.8.2"
        resources:
          limits:
            cpu: "2000m"
            memory: "1Gi"
          requests:
            cpu: "500m"
            memory: "256Mi"`,
    grade: 'A',
    gradeClass: '',
    gradeTitle: 'Multi-Cloud Optimized',
    gradeDesc: 'High-availability chart configured with zone anti-affinity and zero-downtime rolling updates.',
    passedChecks: '46 / 50 Checks Passed',
    scanTime: '15ms',
    securityScore: 92,
    reliabilityScore: 98,
    upgradeScore: 95,
    findings: [
      { type: 'pass', title: 'Multi-Zone Pod Anti-Affinity', desc: 'Workloads spread evenly across OCI/GCP availability zones for fault tolerance.' },
      { type: 'pass', title: 'Zero Downtime RollingUpdate', desc: 'maxUnavailable set to 0 ensuring seamless rolling chart upgrades.' },
      { type: 'pass', title: 'Cloud Provider Annotations Validated', desc: 'Compliant with Oracle OCI Network Load Balancer schema.' },
      { type: 'warn', title: 'PodDisruptionBudget Advisory', desc: 'Consider binding a PDB manifest to safeguard against voluntary node drains.' }
    ]
  }
};

function initHelmDoctorDemo() {
  const sampleSelect = document.getElementById('sample-select');
  const runBtn = document.getElementById('run-analysis-btn');
  const yamlCodeEl = document.getElementById('demo-yaml-code');
  const chartBadge = document.getElementById('chart-status-badge');
  const auditStatusTag = document.getElementById('audit-status-tag');
  
  const gradeCircle = document.getElementById('overall-grade-circle');
  const gradeLetter = document.getElementById('overall-grade-letter');
  const gradeTitle = document.getElementById('grade-title');
  const gradeDesc = document.getElementById('grade-desc');
  const passedChecksCount = document.getElementById('passed-checks-count');
  const scanTime = document.getElementById('scan-time');

  const catScoreSec = document.getElementById('cat-score-security');
  const catBarSec = document.getElementById('cat-bar-security');
  const catScoreRel = document.getElementById('cat-score-reliability');
  const catBarRel = document.getElementById('cat-bar-reliability');
  const catScoreUpg = document.getElementById('cat-score-upgrade');
  const catBarUpg = document.getElementById('cat-bar-upgrade');
  const findingsList = document.getElementById('findings-list');

  function renderPreset(presetKey, isAnimated = true) {
    const data = HELM_PRESETS[presetKey];
    if (!data) return;

    if (chartBadge) chartBadge.textContent = data.badge;
    if (yamlCodeEl) yamlCodeEl.textContent = data.yaml;

    if (auditStatusTag) {
      auditStatusTag.textContent = 'Analyzing AST...';
      auditStatusTag.style.color = 'var(--accent-cyan)';
    }

    const duration = isAnimated ? 400 : 0;

    setTimeout(() => {
      if (auditStatusTag) {
        auditStatusTag.textContent = 'Scan Complete ✔';
        auditStatusTag.style.color = 'var(--accent-emerald)';
      }

      // Grade update
      if (gradeCircle) {
        gradeCircle.className = 'grade-circle ' + data.gradeClass;
      }
      if (gradeLetter) gradeLetter.textContent = data.grade;
      if (gradeTitle) gradeTitle.textContent = data.gradeTitle;
      if (gradeDesc) gradeDesc.textContent = data.gradeDesc;
      if (passedChecksCount) passedChecksCount.textContent = data.passedChecks;
      if (scanTime) scanTime.textContent = `Scan Duration: ${data.scanTime}`;

      // Category scores & bars
      if (catScoreSec) catScoreSec.textContent = `${data.securityScore}%`;
      if (catBarSec) catBarSec.style.width = `${data.securityScore}%`;

      if (catScoreRel) catScoreRel.textContent = `${data.reliabilityScore}%`;
      if (catBarRel) catBarRel.style.width = `${data.reliabilityScore}%`;

      if (catScoreUpg) catScoreUpg.textContent = `${data.upgradeScore}%`;
      if (catBarUpg) catBarUpg.style.width = `${data.upgradeScore}%`;

      // Findings
      if (findingsList) {
        findingsList.innerHTML = '';
        data.findings.forEach(f => {
          const item = document.createElement('div');
          item.className = `finding-item ${f.type}`;
          const iconSymbol = f.type === 'pass' ? '✔' : f.type === 'warn' ? '⚠' : '✖';
          item.innerHTML = `
            <span class="finding-icon">${iconSymbol}</span>
            <div class="finding-text">
              <strong>${f.title}</strong> — ${f.desc}
            </div>
          `;
          findingsList.appendChild(item);
        });
      }

      if (isAnimated) {
        showToast(`Helm Doctor evaluated: Grade ${data.grade} (${data.passedChecks})`);
      }
    }, duration);
  }

  if (sampleSelect) {
    sampleSelect.addEventListener('change', (e) => {
      renderPreset(e.target.value, true);
    });
  }

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const activePreset = sampleSelect ? sampleSelect.value : 'production-grade';
      renderPreset(activePreset, true);
    });
  }

  // Initial load
  renderPreset('production-grade', false);
}

/* ==========================================================================
   7. Clipboard 1-Click Action & Toast Notifications
   ========================================================================== */
function initClipboardButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          // Fallback if clipboard API is restricted
          const tempInput = document.createElement('input');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast(`Copied "${textToCopy}" to clipboard!`);
        });
      }
    });
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>⚡</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

/* ==========================================================================
   8. Contact Form Handler (Direct Email Draft)
   ========================================================================== */
window.handleFormSubmit = function(event) {
  event.preventDefault();
  
  const name = document.getElementById('form-name').value;
  const company = document.getElementById('form-company').value;
  const subject = document.getElementById('form-subject').value;
  const message = document.getElementById('form-message').value;

  const mailtoBody = `Hi Arunesh,%0D%0A%0D%0AMy name is ${encodeURIComponent(name)} from ${encodeURIComponent(company)}.%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0ABest regards,%0D%0A${encodeURIComponent(name)}`;
  const mailtoUrl = `mailto:aruneshj07@gmail.com?subject=${encodeURIComponent(`[Opportunity] ${subject} - ${company}`)}&body=${mailtoBody}`;

  showToast('Opening your email client with prefilled details...');
  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 400);
};
