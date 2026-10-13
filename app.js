(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelector('#year').textContent = String(new Date().getFullYear());
  const menu = document.querySelector('#mobile-nav');
  const menuButton = document.querySelector('.menu-toggle');
  const closeMenu = () => {menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation');};
  menuButton.addEventListener('click', () => {const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');});
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {if(e.key === 'Escape' && !menu.hidden){closeMenu();menuButton.focus();}});
  document.addEventListener('click', e => {if(!e.target.closest('.header'))closeMenu();});
  window.matchMedia('(min-width: 621px)').addEventListener('change', e => {if(e.matches)closeMenu();});

  const scenarios = {
    research:{prompt:'“Turn a business question into a clear research brief.”',agents:[['Research agent','Gather relevant information'],['Analysis agent','Connect findings and context'],['Synthesis agent','Create a structured brief']],result:'A focused brief, ready for human review.'},
    knowledge:{prompt:'“Find an answer across our internal knowledge.”',agents:[['Retrieval agent','Find relevant documents'],['Context agent','Connect the right sources'],['Answer agent','Prepare a grounded response']],result:'A contextual answer with sources for review.'},
    operations:{prompt:'“Prepare the next steps for a new project request.”',agents:[['Intake agent','Structure the project request'],['Planning agent','Map tasks and dependencies'],['Coordination agent','Prepare a proposed action plan']],result:'A proposed plan, ready for human approval.'}
  };
  let scenario = 'research';
  let runId = 0;
  const tabs = [...document.querySelectorAll('[data-scenario]')];
  const nodes = [...document.querySelectorAll('.agent-node')];
  const runButton = document.querySelector('#run-workflow');
  const demoStatus = document.querySelector('#demo-status');
  const resetNodes = () => nodes.forEach(n => {n.classList.remove('active','complete');n.querySelector('.node-status').setAttribute('aria-label','Ready');});
  function selectScenario(next) {
    runId++; scenario = next; resetNodes(); runButton.disabled = false;
    runButton.innerHTML = 'Run workflow <span aria-hidden="true">↗</span>';
    demoStatus.textContent = 'See how the agents connect.';
    tabs.forEach(t => {const selected = t.dataset.scenario === next;t.setAttribute('aria-selected',String(selected));t.tabIndex = selected ? 0 : -1;});
    document.querySelector('#workflow-panel').setAttribute('aria-labelledby','tab-'+next);
    document.querySelector('#scenario-prompt').textContent = scenarios[next].prompt;
    nodes.forEach((n,i)=>{n.querySelector('.node-name').textContent=scenarios[next].agents[i][0];n.querySelector('.node-task').textContent=scenarios[next].agents[i][1];});
    document.querySelector('#workflow-result').textContent = scenarios[next].result;
  }
  tabs.forEach((t,i)=>{
    t.addEventListener('click',()=>selectScenario(t.dataset.scenario));
    t.addEventListener('keydown',e=>{let index=i;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();tabs[index].focus();selectScenario(tabs[index].dataset.scenario);});
  });
  const delay = ms => new Promise(resolve=>setTimeout(resolve,ms));
  runButton.addEventListener('click',async()=>{
    const currentRun = ++runId;resetNodes();runButton.disabled=true;runButton.textContent='Running…';
    for(let i=0;i<nodes.length;i++){
      if(currentRun!==runId)return;
      nodes[i].classList.add('active');nodes[i].querySelector('.node-status').setAttribute('aria-label','Working');
      demoStatus.textContent=scenarios[scenario].agents[i][0]+' is working…';
      await delay(reducedMotion ? 250 : 900);
      if(currentRun!==runId)return;
      nodes[i].classList.remove('active');nodes[i].classList.add('complete');nodes[i].querySelector('.node-status').setAttribute('aria-label','Complete');
    }
    demoStatus.textContent='Complete. Ready for human review.';
    runButton.disabled=false;runButton.innerHTML='Run again <span aria-hidden="true">↻</span>';
  });

  // A local geometric illustration; no data, telemetry or external AI calls.
  const canvas = document.querySelector('#neural-canvas');
  const ctx = canvas.getContext('2d');
  if(!ctx)return;
  let width=0,height=0,angle=.38,visible=true,lastTime=0;
  const points=[];
  const count=190;
  const golden=Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<count;i++){const y=1-2*i/(count-1);const r=Math.sqrt(1-y*y);const t=golden*i;points.push({x:Math.cos(t)*r,y,z:Math.sin(t)*r});}
  const edges=[];
  for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){const a=points[i],b=points[j];const distance=(a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)**2;if(distance<.135)edges.push([i,j]);}
  function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  function draw(){
    if(!width||!height)return;
    ctx.clearRect(0,0,width,height);
    const cx=width*.50,cy=height*.49,radius=Math.min(width*.35,height*.365);
    const ca=Math.cos(angle),sa=Math.sin(angle),tilt=.14;
    const projected=points.map(p=>{const x=p.x*ca+p.z*sa;const z=p.z*ca-p.x*sa;const y=p.y*Math.cos(tilt)-z*Math.sin(tilt);const zz=z*Math.cos(tilt)+p.y*Math.sin(tilt);const perspective=1+zz*.085;return{x:cx+x*radius*perspective,y:cy+y*radius*perspective,z:zz};});
    ctx.save();
    ctx.strokeStyle='#a1ae8c55';ctx.lineWidth=.65;
    ctx.beginPath();ctx.ellipse(cx,cy,radius*1.28,radius*.31,-.48,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#acb49e33';ctx.beginPath();ctx.ellipse(cx,cy,radius*.73,radius*1.21,.55,0,Math.PI*2);ctx.stroke();
    const glow=ctx.createRadialGradient(cx-radius*.13,cy-radius*.13,1,cx,cy,radius*.72);glow.addColorStop(0,'#c3f35b70');glow.addColorStop(.6,'#c3f35b12');glow.addColorStop(1,'#c3f35b00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,radius*.78,0,Math.PI*2);ctx.fill();
    for(const [i,j]of edges){const a=projected[i],b=projected[j],depth=(a.z+b.z)/2;ctx.strokeStyle=`rgba(55,78,30,${.09+(depth+1)*.15})`;ctx.lineWidth=depth>0?.8:.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    const sorted=projected.map((p,i)=>({...p,i})).sort((a,b)=>a.z-b.z);
    for(const p of sorted){const isAccent=p.i%23===0;const size=isAccent?3.4:1.25+(p.z+1)*.6;if(isAccent){ctx.beginPath();ctx.arc(p.x,p.y,6.5,0,Math.PI*2);ctx.fillStyle='#c3f35b25';ctx.fill();}ctx.beginPath();ctx.arc(p.x,p.y,size,0,Math.PI*2);ctx.fillStyle=isAccent?'#8bbb38':`rgba(37,58,22,${.2+(p.z+1)*.34})`;ctx.fill();}
    ctx.strokeStyle='#c3f35b';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cx,cy,radius*.57,radius*.15,.4,0,Math.PI*2);ctx.stroke();
    const cross=(x,y)=>{ctx.strokeStyle='#a4ad9366';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.moveTo(x,y-5);ctx.lineTo(x,y+5);ctx.stroke();};cross(cx-radius*1.16,cy-radius*.78);cross(cx+radius*1.13,cy+radius*.70);
    ctx.restore();
  }
  function animate(time){if(visible&&!document.hidden){if(lastTime){angle+=Math.min(time-lastTime,40)*.000065;}draw();}lastTime=time;if(!reducedMotion)requestAnimationFrame(animate);}
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;lastTime=0;},{threshold:0}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{lastTime=0;});
  resize();if(!reducedMotion)requestAnimationFrame(animate);
})();
