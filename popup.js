/* Onde Parei? — armazenamento totalmente local, sem rastreamento de navegação. */
const KEY='ondeParei.v1';
const $=(q)=>document.querySelector(q);
const main=$('#main');
let db={version:1,works:[],history:[]}, page='library',search='',filter='all',kind='all',extractedLinks=[];
const statuses={ongoing:'Acompanhando',planned:'Quero ver/ler',paused:'Pausado',completed:'Concluído',dropped:'Abandonado'};
const types={anime:'Anime',manga:'Mangá'};
const uid=()=>crypto.randomUUID();
const escapeHtml=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validUrl=(url)=>{try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)}catch{return false}};
const integer=(value)=>Number.isSafeInteger(Number(value))&&Number(value)>=0?Number(value):0;
const save=async()=>chrome.storage.local.set({[KEY]:db});
const now=()=>new Date().toISOString();
function log(work,from,to){db.history.unshift({id:uid(),workId:work.id,title:work.title,type:work.type,from,to,date:now()});db.history=db.history.slice(0,1000)}
async function changeProgress(id,delta){const w=db.works.find(x=>x.id===id);if(!w)return;const next=Math.max(0,w.progress+delta);if(next===w.progress||delta>0&&w.total&&next>w.total)return;const old=w.progress;w.progress=next;w.updatedAt=now();log(w,old,next);await save();render()}
async function removeWork(id){const w=db.works.find(x=>x.id===id);if(!w||!confirm('Excluir "'+w.title+'" e seu histórico?'))return;db.works=db.works.filter(x=>x.id!==id);db.history=db.history.filter(x=>x.workId!==id);await save();render()}
function openEditor(id){const w=db.works.find(x=>x.id===id);extractedLinks=Array.isArray(w?.links)?w.links.slice():[];$('#editor-title').textContent=w?'Editar obra':'Nova obra';$('#work-id').value=w?.id||'';$('#title').value=w?.title||'';$('#type').value=w?.type||'manga';$('#status').value=w?.status||'ongoing';$('#url').value=w?.url||'';$('#progress').value=w?.progress??0;$('#total').value=w?.total||'';$('#tags').value=(w?.tags||[]).join(', ');$('#notes').value=w?.notes||'';$('#description').value=w?.description||'';$('#cover').value=w?.cover||'';$('#extraction-result').textContent='';$('#form-error').textContent='';$('#editor').showModal()}
async function getActiveWebsiteTab(){
  // Side panels are extension contexts: currentWindow may not refer to the site window.
  const windows=await chrome.windows.getAll({windowTypes:['normal']});
  const preferred=windows.sort((a,b)=>Number(Boolean(b.focused))-Number(Boolean(a.focused)));
  for(const window of preferred){
    const tabs=await chrome.tabs.query({windowId:window.id,active:true});
    const tab=tabs[0];
    if(tab?.id&&tab.url&&validUrl(tab.url))return tab;
  }
  const active=await chrome.tabs.query({active:true,windowType:'normal'});
  return active.find(tab=>tab.id&&tab.url&&validUrl(tab.url))||null;
}
async function useTab(){try{const tab=await getActiveWebsiteTab();if(tab?.url&&validUrl(tab.url)){$('#url').value=tab.url;if(!$('#title').value)$('#title').value=(tab.title||'').slice(0,150)}else $('#form-error').textContent='Não encontrei uma aba de site ativa. Selecione a página e tente novamente.'}catch{$('#form-error').textContent='Não foi possível ler a aba atual.'}}
async function submitWork(event){event.preventDefault();const id=$('#work-id').value;const title=$('#title').value.trim();const url=$('#url').value.trim();const progress=integer($('#progress').value);const total=$('#total').value.trim()?integer($('#total').value):null;if(!title||!validUrl(url)||($('#cover').value.trim()&&!validUrl($('#cover').value.trim()))||total!==null&&total<progress){$('#form-error').textContent='Informe título e URL válida; o total deve ser maior ou igual ao progresso.';return}const prev=db.works.find(w=>w.id===id);const work={id:prev?.id||uid(),title,type:$('#type').value,status:$('#status').value,url,progress,total,tags:[...new Set($('#tags').value.split(',').map(v=>v.trim()).filter(Boolean))].slice(0,20),notes:$('#notes').value.trim(),description:$('#description').value.trim(),cover:$('#cover').value.trim(),links:extractedLinks.slice(0,200),createdAt:prev?.createdAt||now(),updatedAt:now()};if(prev){db.works=db.works.map(w=>w.id===id?work:w);if(prev.progress!==progress)log(work,prev.progress,progress)}else{db.works.unshift(work);if(progress)log(work,0,progress)}await save();$('#editor').close();render()}
function renderLibrary(){const works=db.works.filter(w=>(kind==='all'||w.type===kind)&&(filter==='all'||w.status===filter)&&(w.title+' '+w.tags.join(' ')).toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));main.innerHTML=`<div class="stats">${db.works.length} obras · ${db.works.filter(w=>w.status==='ongoing').length} acompanhando</div><div class="toolbar"><input id="search" placeholder="Buscar obras e tags..." aria-label="Buscar obras" value="${escapeHtml(search)}"><select id="kind" aria-label="Tipo"><option value="all">Todos os tipos</option><option value="anime" ${kind==='anime'?'selected':''}>Animes</option><option value="manga" ${kind==='manga'?'selected':''}>Mangás</option></select></div><div class="toolbar"><select id="filter" aria-label="Filtrar status"><option value="all">Todos os status</option>${Object.entries(statuses).map(([k,v])=>`<option value="${k}" ${filter===k?'selected':''}>${v}</option>`).join('')}</select></div><div class="stack">${works.length?works.map(w=>`<article class="item"><div class="item-head"><div><h3>${escapeHtml(w.title)}</h3><span class="meta">${types[w.type]} · ${statuses[w.status]}</span></div><span class="pill">${w.type==='anime'?'EP':'CAP'}</span></div><div class="progress-row"><strong>${w.progress}${w.total===null?'':' / '+w.total} ${w.type==='anime'?'assistidos':'lidos'}</strong><span class="meta">${w.total?Math.round(w.progress/w.total*100)+'%':''}</span></div><div class="item-actions"><button data-act="minus" data-id="${w.id}" aria-label="Reduzir progresso">− 1</button><button data-act="plus" data-id="${w.id}" class="primary" aria-label="Marcar próximo como concluído">✓ + 1</button><button data-act="edit" data-id="${w.id}">Editar</button><button data-act="delete" data-id="${w.id}" class="danger">Excluir</button><a class="link" href="${escapeHtml(w.url)}" target="_blank" rel="noopener noreferrer">Abrir site ↗</a></div>${w.links?.length?`<details class="extracted-list"><summary>${w.links.length} links extraídos</summary><div class="extracted-items">${w.links.map(l=>`<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="link">${escapeHtml(l.title)}</a>`).join('')}</div></details>`:''}${w.tags.length?`<div class="footer">${escapeHtml(w.tags.join(' · '))}</div>`:''}</article>`).join(''):'<div class="empty">Nenhuma obra encontrada.<br>Use “+ Nova obra” para começar.</div>'}</div>`;$('#search').addEventListener('input',e=>{search=e.target.value;const start=e.target.selectionStart;renderLibrary();const field=$('#search');field.focus();field.setSelectionRange(start,start)});$('#filter').addEventListener('change',e=>{filter=e.target.value;render()});$('#kind').addEventListener('change',e=>{kind=e.target.value;render()})}
function renderHistory(){main.innerHTML=`<h2 class="section-title">Histórico de progresso</h2>${db.history.length?db.history.map(h=>`<div class="activity"><strong>${escapeHtml(h.title)}</strong><span class="meta">${types[h.type]||'Obra'} · ${h.from} → ${h.to} · ${new Date(h.date).toLocaleString('pt-BR')}</span></div>`).join(''):'<div class="empty">Você ainda não marcou nenhum capítulo ou episódio.</div>'}`}
function renderSettings(){main.innerHTML=`<h2 class="section-title">Seus dados</h2><p class="info">Tudo fica salvo neste perfil do Chrome, neste dispositivo. Não há conta, sincronização ou coleta de histórico de navegação. Faça backups regularmente.</p><div class="stack"><button id="export">Exportar backup JSON</button><button id="import">Importar backup JSON</button><input id="import-file" type="file" accept=".json,application/json" hidden><button id="clear" class="danger">Apagar todos os dados</button></div><p class="footer">O backup inclui obras, links, notas e histórico de progresso.</p>`;$('#export').onclick=exportData;$('#import').onclick=()=>$('#import-file').click();$('#import-file').onchange=importData;$('#clear').onclick=async()=>{if(confirm('Apagar permanentemente todas as obras e histórico deste navegador?')){db={version:1,works:[],history:[]};await save();render()}}}
function exportData(){const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='onde-parei-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function validateBackup(data){if(!data||data.version!==1||!Array.isArray(data.works)||!Array.isArray(data.history)||data.works.length>100000||data.history.length>100000)return false;return data.works.every(w=>typeof w.id==='string'&&typeof w.title==='string'&&w.title.length<=150&&['anime','manga'].includes(w.type)&&Object.keys(statuses).includes(w.status)&&typeof w.url==='string'&&validUrl(w.url)&&Number.isSafeInteger(w.progress)&&w.progress>=0&&(w.total===null||Number.isSafeInteger(w.total)&&w.total>=w.progress)&&Array.isArray(w.tags)&&w.tags.length<=20&&w.tags.every(t=>typeof t==='string')&&typeof w.notes==='string'&&w.notes.length<=2000&&(w.links===undefined||Array.isArray(w.links)&&w.links.length<=200&&w.links.every(l=>l&&typeof l.title==='string'&&l.title.length<=120&&typeof l.url==='string'&&validUrl(l.url)))&&(w.description===undefined||typeof w.description==='string'&&w.description.length<=5000)&&(w.cover===undefined||typeof w.cover==='string'&&(w.cover===''||validUrl(w.cover)))&&typeof w.createdAt==='string'&&typeof w.updatedAt==='string')&&data.history.every(h=>typeof h.id==='string'&&typeof h.title==='string'&&typeof h.workId==='string'&&['anime','manga'].includes(h.type)&&Number.isSafeInteger(h.from)&&Number.isSafeInteger(h.to)&&typeof h.date==='string')}
async function importData(e){const f=e.target.files?.[0];if(!f)return;try{if(f.size>15*1024*1024)throw Error('Arquivo muito grande.');const data=JSON.parse(await f.text());if(!validateBackup(data))throw Error('Arquivo de backup inválido ou incompatível.');if(!confirm('Substituir a biblioteca e o histórico atuais por este backup?'))return;db=data;await save();render();alert('Backup importado com sucesso.')}catch(err){alert(err instanceof Error?err.message:'Falha ao importar.')}finally{e.target.value=''}}
function render(){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('selected',b.dataset.page===page));if(page==='history')renderHistory();else if(page==='settings')renderSettings();else renderLibrary()}
main.addEventListener('click',async e=>{const button=e.target.closest('button[data-act]');if(!button)return;const {act,id}=button.dataset;if(act==='plus')await changeProgress(id,1);if(act==='minus')await changeProgress(id,-1);if(act==='edit')openEditor(id);if(act==='delete')await removeWork(id)});
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>{page=b.dataset.page;render()}));

/** Executado somente após clique explícito, no DOM da aba ativa. Sem rede ou monitoramento. */
function extractDocument(){
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const meta=(...names)=>{for(const name of names){const el=document.querySelector('meta[property="'+name+'"],meta[name="'+name+'"]');if(el?.content)return clean(el.content)}return ''};
  const all=[];
  for(const node of document.querySelectorAll('script[type="application/ld+json"]')){
    try{
      const walk=x=>{if(!x||typeof x!=='object')return;if(Array.isArray(x)){x.forEach(walk);return}all.push(x);if(x['@graph'])walk(x['@graph'])};
      walk(JSON.parse(node.textContent||'null'));
    }catch{}
  }
  const obj=all.find(x=>/CreativeWork|TVSeries|Book|ComicSeries|VideoObject|Episode|Article/i.test(String(x['@type']||'')))||{};
  const heading=clean(document.querySelector('main h1,article h1,h1')?.textContent);
  const title=clean(obj.name||meta('og:title','twitter:title')||heading||document.title).slice(0,150);
  const normalize=u=>{try{const v=new URL(u,location.href);return ['http:','https:'].includes(v.protocol)?v.href:''}catch{return ''}};
  const rawImage=typeof obj.image==='string'?obj.image:Array.isArray(obj.image)?obj.image[0]:obj.image?.url;
  const cover=normalize(rawImage||meta('og:image','twitter:image')||document.querySelector('main img,article img')?.getAttribute('src')||'');
  const description=clean(obj.description||meta('og:description','description','twitter:description')).slice(0,5000);
  const keywords=Array.isArray(obj.keywords)?obj.keywords:typeof obj.keywords==='string'?obj.keywords.split(','):[];
  const domTags=[...document.querySelectorAll('[rel="tag"],[itemprop="genre"]')].slice(0,20).map(e=>clean(e.textContent));
  const tags=[...new Set([...keywords,...domTags].map(clean).filter(t=>t.length>1&&t.length<50))].slice(0,20);
  const blob=(location.hostname+' '+title+' '+meta('og:type')+' '+String(obj['@type']||'')).toLowerCase();
  const type=/anime|epis[oó]dio|episode|watch|stream|video|tvseries/.test(blob)?'anime':/mang[aá]|manhwa|manhua|chapter|cap[ií]tulo|comic|scan|book/.test(blob)?'manga':null;
  const links=[];
  const seen=new Set();
  for(const a of document.querySelectorAll('main a[href],article a[href],a[href*="chapter"],a[href*="episode"],a[href*="capitulo"],a[href*="episodio"]')){
    const label=clean(a.textContent||a.getAttribute('title')||'').slice(0,120);
    const url=normalize(a.getAttribute('href')||'');
    const candidate=(label+' '+url).toLowerCase();
    if(!url||seen.has(url)||!/(chapter|cap[ií]tulo|episode|epis[oó]dio|ep\s*\d+)/i.test(candidate))continue;
    seen.add(url);links.push({title:label||'Capítulo/Episódio',url});
    if(links.length>=200)break;
  }
  const count=Number(obj.numberOfEpisodes||obj.numberOfItems);
  return {title,url:location.href,cover,description,tags,type,total:Number.isSafeInteger(count)&&count>0?count:null,links};
}
async function extractPage(){
  const button=$('#extract-page');
  button.disabled=true;
  $('#form-error').textContent='';
  $('#extraction-result').textContent='Analisando a aba atual...';
  try{
    const tab=await getActiveWebsiteTab();
    if(!tab)throw Error('Não encontrei uma aba de site ativa. Selecione a aba com o mangá ou anime e tente novamente.');
    const origin=new URL(tab.url).origin+'/*';
    const granted=await chrome.permissions.contains({origins:[origin]}) ||
      await chrome.permissions.request({origins:[origin]});
    if(!granted)throw Error('Autorize o acesso a este site para extrair seus dados.');
    const result=await chrome.scripting.executeScript({target:{tabId:tab.id},func:extractDocument});
    const data=result?.[0]?.result;
    if(!data)throw Error('Não foi possível obter informações desta página.');
    if(data.title)$('#title').value=data.title;
    if(validUrl(data.url))$('#url').value=data.url;
    if(data.type)$('#type').value=data.type;
    if(data.cover)$('#cover').value=data.cover;
    if(data.description)$('#description').value=data.description;
    if(data.tags?.length)$('#tags').value=data.tags.join(', ');
    if(data.total)$('#total').value=data.total;
    extractedLinks=Array.isArray(data.links)?data.links.filter(x=>x&&typeof x.title==='string'&&validUrl(x.url)).slice(0,200):[];
    $('#extraction-result').textContent='Extração concluída. '+(data.links?.length||0)+' possíveis links de capítulos/episódios encontrados e preparados para salvar. Confira e corrija os campos antes de salvar.';
  }catch(e){
    $('#extraction-result').textContent='';
    $('#form-error').textContent='Falha na extração: '+(e?.message||'Site não compatível. Preencha manualmente.');
  }finally{button.disabled=false}
}

$('#extract-page').onclick=extractPage;
$('#add').onclick=()=>openEditor();$('#close-editor').onclick=()=>$('#editor').close();$('#use-tab').onclick=useTab;$('#work-form').onsubmit=submitWork;
(async()=>{try{const result=await chrome.storage.local.get(KEY);if(result[KEY]&&validateBackup(result[KEY]))db=result[KEY]}catch(e){console.error('Falha ao carregar dados:',e)}render()})();
