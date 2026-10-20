(() => {
 const dialog=document.querySelector('#fish-viewer'), image=document.querySelector('#viewer-image'), label=document.querySelector('#viewer-label');
 let items=[],position=0,opener=null;
 function show(){const a=items[position];image.src=a.href;image.alt=`${a.dataset.species} — ${a.dataset.variant}`;label.textContent=image.alt;}
 function move(step){position=(position+step+items.length)%items.length;show();}
 document.querySelectorAll('a[data-viewer]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();opener=a;
  const inSpoiler=!!a.closest('.spoiler'), seen=new Set();
  items=[...document.querySelectorAll('a[data-viewer]')].filter(x=>{
   if(!!x.closest('.spoiler')!==inSpoiler||x.closest('[hidden]')||x.closest('details:not([open])'))return false;
   if(seen.has(x.href))return false;seen.add(x.href);return true;
  });
  position=items.findIndex(x=>x.href===a.href);show();dialog.showModal();
 }));
 document.querySelector('#viewer-prev').addEventListener('click',()=>move(-1));
 document.querySelector('#viewer-next').addEventListener('click',()=>move(1));
 document.querySelector('#viewer-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>opener?.focus());
 const baitToggle=document.querySelector('#toggle-baits');
 baitToggle?.addEventListener('click',()=>{const groups=[...document.querySelectorAll('.bait-group')];const expand=groups.some(group=>!group.open);groups.forEach(group=>group.open=expand);baitToggle.textContent=expand?'Collapse all baits':'Expand all baits';baitToggle.setAttribute('aria-expanded',String(expand));});
 document.querySelectorAll('.spoiler-cover').forEach(button=>button.addEventListener('click',()=>button.remove()));
 const input=document.querySelector('#q, #search');
 input?.addEventListener('input',()=>{
  const q=input.value.toLowerCase().trim();
  document.querySelectorAll('tbody tr[data-search]').forEach(r=>{r.hidden=!r.dataset.search.includes(q);});
  document.querySelectorAll('.bait-group').forEach(g=>{g.hidden=![...g.querySelectorAll('tbody tr[data-search]')].some(r=>!r.hidden);});
  document.querySelectorAll('article[data-name]').forEach(a=>{a.hidden=!a.dataset.name.includes(q);});
  document.querySelectorAll('.boss-category, .spoiler-section').forEach(category=>{category.hidden=![...category.querySelectorAll('tbody tr[data-search], article[data-name]')].some(item=>!item.hidden);});
 });
})();
