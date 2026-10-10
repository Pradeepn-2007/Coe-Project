/* =========================================================
   INITIALIZE
========================================================= */



function analyticsBar(label, value, total) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return `<div style="margin:10px 0;"><div style="display:flex;justify-content:space-between;gap:12px;"><span>${escapeHTML(label)}</span><strong>${value} (${pct}%)</strong></div><div style="height:8px;border-radius:6px;background:var(--border);overflow:hidden;margin-top:5px;"><div style="height:100%;width:${pct}%;background:var(--accent);border-radius:6px;"></div></div></div>`;
}

function renderAnalytics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.filter(t => t.status === 'progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const high = tasks.filter(t => t.priority === 'high').length;

  const completionEl = document.getElementById('analyticsCompletion');
  if (completionEl) completionEl.textContent = total ? Math.round((completed / total) * 100) + '%' : '0%';
  const totalEl = document.getElementById('analyticsTotal');
  if (totalEl) totalEl.textContent = total;
  const pendingEl = document.getElementById('analyticsPending');
  if (pendingEl) pendingEl.textContent = todo + progress;
  const highEl = document.getElementById('analyticsHigh');
  if (highEl) highEl.textContent = high;

  const statusEl = document.getElementById('statusAnalytics');
  if (statusEl) statusEl.innerHTML = analyticsBar('To Do', todo, total) + analyticsBar('In Progress', progress, total) + analyticsBar('Completed', completed, total);

  const priorityEl = document.getElementById('priorityAnalytics');
  if (priorityEl) {
    const hp = tasks.filter(t => t.priority === 'high').length;
    const mp = tasks.filter(t => t.priority === 'medium').length;
    const lp = tasks.filter(t => t.priority === 'low').length;
    priorityEl.innerHTML = analyticsBar('High', hp, total) + analyticsBar('Medium', mp, total) + analyticsBar('Low', lp, total);
  }

  const subjects = {};
  tasks.forEach(t => { subjects[t.subject] = (subjects[t.subject] || 0) + 1; });
  const subjectEl = document.getElementById('subjectAnalytics');
  if (subjectEl) {
    const rows = Object.entries(subjects).sort((a,b) => b[1]-a[1]);
    subjectEl.innerHTML = rows.length ? rows.map(([subject,count]) => analyticsBar(subject,count,total)).join('') : '<p class="muted">No tasks yet.</p>';
  }
}


