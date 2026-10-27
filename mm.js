// 27 oct 2026 (Jeremy): "More matches today" in Daily Score. Besides the match of the day (unchanged), up to 8 more matches of the big
// leagues, one prediction per match (3 pts exact score, 1 pt right result), and one Joker a day (x2 on one match, unlocked by a video).
// Server: Supabase function ds-multi (SQL ds_mm_*), the points count in every ranking and in the weekly $BATON prizes.
// 27 oct 2026 (17h56): every settled prediction wins $BATON (2,000 exact / 500 result / 100 missed, x2 Joker), collected with a rewarded video.
// Telegram only (the player is identified by the initData); the card sits right under the match of the day.
(() => {
  const tw = window.Telegram && Telegram.WebApp;
  if (!tw || !tw.initData) return;
  const FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/ds-multi';
  const L = {
    en: { h: '⚽ More matches today', h2: '⚽ More matches tomorrow', rules: '3 pts exact score · 1 pt right result · 🎬 x2 on every match with a video', save: 'Saved ✅', joker: '🃏 x2', jokerOn: '🃏 Joker x2', jokerAsk: 'Watch a short video to put your Joker (x2) on this match?', live: 'LIVE', ft: 'Final', yours: 'You', pts: 'pts', closed: 'Started', err: 'Error, try again', started: 'This match has started', nopick: 'Make your prediction first', jokerused: 'Your Joker is already used on a match that started', vid: 'No video available right now, try again later', tr: '📊 See the trend + the prono · 🎬', trN: 'What everyone played, and the prono from the odds', pr: '🤖 Prono', fav: (t, p) => '' + t + ' favourite (' + p + '%)', tight: 'Tight match', goals: (g) => '~' + g + ' goals expected', draw: 'Draw', nb: 'players', claim: (n) => '🎬 Collect +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON won ✅', claimed: 'Already collected', btr: '💰 $BATON every match: 2,000 exact score · 500 right result · 100 missed', day: (n) => '+' + n + ' pts today' },
    fr: { h: '⚽ Plus de matchs aujourd\'hui', h2: '⚽ Plus de matchs demain', rules: '3 pts score exact · 1 pt bon résultat · 🎬 x2 sur chaque match avec une vidéo', save: 'Enregistré ✅', joker: '🃏 x2', jokerOn: '🃏 Joker x2', jokerAsk: 'Regarder une courte vidéo pour mettre ton Joker (x2) sur ce match ?', live: 'EN DIRECT', ft: 'Terminé', yours: 'Toi', pts: 'pts', closed: 'Commencé', err: 'Erreur, réessaie', started: 'Ce match a commencé', nopick: 'Fais d\'abord ton prono', jokerused: 'Ton Joker est déjà sur un match commencé', vid: 'Pas de vidéo dispo pour le moment, réessaie plus tard', tr: '📊 Voir la tendance + le prono · 🎬', trN: 'Ce que tout le monde a joué, et le prono des cotes', pr: '🤖 Prono', fav: (t, p) => '' + t + ' favori (' + p + ' %)', tight: 'Match serré', goals: (g) => '~' + g + ' buts attendus', draw: 'Nul', nb: 'joueurs', claim: (n) => '🎬 Récupérer +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON gagnés ✅', claimed: 'Déjà récupéré', btr: '💰 Des $BATON à chaque match : 2 000 score exact · 500 bon résultat · 100 raté', day: (n) => '+' + n + ' pts aujourd\'hui' },
    es: { h: '⚽ Más partidos hoy', h2: '⚽ Más partidos mañana', rules: '3 pts resultado exacto · 1 pt acierto · 🎬 x2 en cada partido con un vídeo', save: 'Guardado ✅', joker: '🃏 x2', jokerOn: '🃏 Comodín x2', jokerAsk: '¿Ver un vídeo corto para poner tu Comodín (x2) en este partido?', live: 'EN VIVO', ft: 'Final', yours: 'Tú', pts: 'pts', closed: 'Empezado', err: 'Error, inténtalo de nuevo', started: 'Este partido ha empezado', nopick: 'Haz primero tu pronóstico', jokerused: 'Tu Comodín ya está en un partido empezado', vid: 'No hay vídeo disponible, inténtalo más tarde', tr: '📊 Ver la tendencia + el pronóstico · 🎬', trN: 'Lo que todos jugaron, y el pronóstico de las cuotas', pr: '🤖 Pronóstico', fav: (t, p) => '' + t + ' favorito (' + p + ' %)', tight: 'Partido igualado', goals: (g) => '~' + g + ' goles esperados', draw: 'Empate', nb: 'jugadores', claim: (n) => '🎬 Cobrar +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON ganados ✅', claimed: 'Ya cobrado', btr: '💰 $BATON en cada partido: 2.000 resultado exacto · 500 acierto · 100 fallo', day: (n) => '+' + n + ' pts hoy' },
    pt: { h: '⚽ Mais jogos hoje', h2: '⚽ Mais jogos amanhã', rules: '3 pts placar exato · 1 pt resultado certo · 🎬 x2 em cada jogo com um vídeo', save: 'Salvo ✅', joker: '🃏 x2', jokerOn: '🃏 Coringa x2', jokerAsk: 'Ver um vídeo curto para colocar seu Coringa (x2) neste jogo?', live: 'AO VIVO', ft: 'Final', yours: 'Você', pts: 'pts', closed: 'Começou', err: 'Erro, tente de novo', started: 'Este jogo começou', nopick: 'Faça seu palpite primeiro', jokerused: 'Seu Coringa já está num jogo que começou', vid: 'Nenhum vídeo disponível agora, tente mais tarde', tr: '📊 Ver a tendência + o palpite · 🎬', trN: 'O que todos jogaram, e o palpite das odds', pr: '🤖 Palpite', fav: (t, p) => '' + t + ' favorito (' + p + '%)', tight: 'Jogo equilibrado', goals: (g) => '~' + g + ' gols esperados', draw: 'Empate', nb: 'jogadores', claim: (n) => '🎬 Resgatar +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON ganhos ✅', claimed: 'Já resgatado', btr: '💰 $BATON em cada jogo: 2.000 placar exato · 500 resultado certo · 100 errado', day: (n) => '+' + n + ' pts hoje' },
    de: { h: '⚽ Mehr Spiele heute', h2: '⚽ Mehr Spiele morgen', rules: '3 Pkt. exaktes Ergebnis · 1 Pkt. Tendenz · 🎬 x2 auf jedes Spiel mit einem Video', save: 'Gespeichert ✅', joker: '🃏 x2', jokerOn: '🃏 Joker x2', jokerAsk: 'Kurzes Video ansehen, um deinen Joker (x2) auf dieses Spiel zu setzen?', live: 'LIVE', ft: 'Ende', yours: 'Du', pts: 'Pkt.', closed: 'Begonnen', err: 'Fehler, versuch es nochmal', started: 'Dieses Spiel hat begonnen', nopick: 'Gib zuerst deinen Tipp ab', jokerused: 'Dein Joker ist schon auf einem laufenden Spiel', vid: 'Gerade kein Video verfügbar, versuch es später', tr: '📊 Trend + Tipp ansehen · 🎬', trN: 'Was alle getippt haben, und der Tipp aus den Quoten', pr: '🤖 Tipp', fav: (t, p) => '' + t + ' Favorit (' + p + ' %)', tight: 'Enges Spiel', goals: (g) => '~' + g + ' Tore erwartet', draw: 'Remis', nb: 'Spieler', claim: (n) => '🎬 Abholen +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON gewonnen ✅', claimed: 'Schon abgeholt', btr: '💰 $BATON bei jedem Spiel: 2.000 exaktes Ergebnis · 500 Tendenz · 100 daneben', day: (n) => '+' + n + ' Pkt. heute' },
    it: { h: '⚽ Altre partite oggi', h2: '⚽ Altre partite domani', rules: '3 pt risultato esatto · 1 pt esito giusto · 🎬 x2 su ogni partita con un video', save: 'Salvato ✅', joker: '🃏 x2', jokerOn: '🃏 Jolly x2', jokerAsk: 'Guardare un breve video per mettere il tuo Jolly (x2) su questa partita?', live: 'LIVE', ft: 'Finale', yours: 'Tu', pts: 'pt', closed: 'Iniziata', err: 'Errore, riprova', started: 'Questa partita è iniziata', nopick: 'Fai prima il tuo pronostico', jokerused: 'Il tuo Jolly è già su una partita iniziata', vid: 'Nessun video disponibile ora, riprova più tardi', tr: '📊 Vedi la tendenza + il pronostico · 🎬', trN: 'Cosa hanno giocato tutti, e il pronostico delle quote', pr: '🤖 Pronostico', fav: (t, p) => '' + t + ' favorita (' + p + '%)', tight: 'Partita equilibrata', goals: (g) => '~' + g + ' gol attesi', draw: 'Pareggio', nb: 'giocatori', claim: (n) => '🎬 Riscuoti +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON vinti ✅', claimed: 'Già riscossi', btr: '💰 $BATON a ogni partita: 2.000 risultato esatto · 500 esito giusto · 100 sbagliato', day: (n) => '+' + n + ' pt oggi' },
    ar: { h: '⚽ مباريات أخرى اليوم', h2: '⚽ مباريات أخرى غدًا', rules: '3 نقاط للنتيجة الدقيقة · نقطة للنتيجة الصحيحة · 🎬 x2 على كل مباراة مع فيديو', save: 'تم الحفظ ✅', joker: '🃏 x2', jokerOn: '🃏 جوكر x2', jokerAsk: 'شاهد فيديو قصيرًا لوضع الجوكر (x2) على هذه المباراة؟', live: 'مباشر', ft: 'انتهت', yours: 'أنت', pts: 'نقاط', closed: 'بدأت', err: 'خطأ، حاول مجددًا', started: 'بدأت هذه المباراة', nopick: 'قدّم توقعك أولًا', jokerused: 'الجوكر مستخدم في مباراة بدأت', vid: 'لا يوجد فيديو الآن، حاول لاحقًا', tr: '📊 شاهد التوجه + التوقع · 🎬', trN: 'ما لعبه الجميع، وتوقع الاحتمالات', pr: '🤖 التوقع', fav: (t, p) => '' + t + ' المرشح (' + p + '%)', tight: 'مباراة متقاربة', goals: (g) => '~' + g + ' أهداف متوقعة', draw: 'تعادل', nb: 'لاعبين', claim: (n) => '🎬 استلم +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON ربحت ✅', claimed: 'تم الاستلام', btr: '💰 \u200f$BATON في كل مباراة: 2,000 للنتيجة الدقيقة · 500 للنتيجة الصحيحة · 100 للخطأ', day: (n) => '\u200e+' + n + ' نقاط اليوم' },
    tr: { h: '⚽ Bugün daha fazla maç', h2: '⚽ Yarın daha fazla maç', rules: 'Tam skor 3 puan · doğru sonuç 1 puan · 🎬 her maçta video ile x2', save: 'Kaydedildi ✅', joker: '🃏 x2', jokerOn: '🃏 Joker x2', jokerAsk: 'Jokerini (x2) bu maça koymak için kısa bir video izle?', live: 'CANLI', ft: 'Bitti', yours: 'Sen', pts: 'puan', closed: 'Başladı', err: 'Hata, tekrar dene', started: 'Bu maç başladı', nopick: 'Önce tahminini yap', jokerused: 'Jokerin zaten başlamış bir maçta', vid: 'Şu an video yok, sonra tekrar dene', tr: '📊 Eğilim + tahmini gör · 🎬', trN: 'Herkesin oynadığı ve oranlara göre tahmin', pr: '🤖 Tahmin', fav: (t, p) => '' + t + ' favori (%' + p + ')', tight: 'Çekişmeli maç', goals: (g) => '~' + g + ' gol bekleniyor', draw: 'Beraberlik', nb: 'oyuncu', claim: (n) => '🎬 Al +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON kazanıldı ✅', claimed: 'Zaten alındı', btr: '💰 Her maçta $BATON: tam skor 2.000 · doğru sonuç 500 · yanlış 100', day: (n) => 'Bugün +' + n + ' puan' },
    ru: { h: '⚽ Ещё матчи сегодня', h2: '⚽ Ещё матчи завтра', rules: '3 очка за точный счёт · 1 очко за исход · 🎬 x2 на каждый матч за видео', save: 'Сохранено ✅', joker: '🃏 x2', jokerOn: '🃏 Джокер x2', jokerAsk: 'Посмотреть короткое видео, чтобы поставить Джокер (x2) на этот матч?', live: 'LIVE', ft: 'Финал', yours: 'Ты', pts: 'очк.', closed: 'Начался', err: 'Ошибка, попробуй ещё', started: 'Матч уже начался', nopick: 'Сначала сделай прогноз', jokerused: 'Джокер уже стоит на начавшемся матче', vid: 'Сейчас нет видео, попробуй позже', tr: '📊 Тенденция + прогноз · 🎬', trN: 'Что выбрали все, и прогноз по коэффициентам', pr: '🤖 Прогноз', fav: (t, p) => '' + t + ' фаворит (' + p + '%)', tight: 'Равный матч', goals: (g) => '~' + g + ' гола ожидается', draw: 'Ничья', nb: 'игроков', claim: (n) => '🎬 Забрать +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON получено ✅', claimed: 'Уже получено', btr: '💰 $BATON за каждый матч: 2 000 точный счёт · 500 исход · 100 мимо', day: (n) => '+' + n + ' очк. сегодня' },
  };
  const lg = () => { let l = 'en'; try { l = String(lang || 'en').slice(0, 2); } catch (e) {} return L[l] ? l : 'en'; };
  const T = () => L[lg()];
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const hap = (k) => { try { k ? tw.HapticFeedback.notificationOccurred(k) : tw.HapticFeedback.impactOccurred('light'); } catch (e) {} };
  const say = (m) => { try { toast(m); } catch (e) { try { tw.showAlert(m); } catch (x) {} } };
  const view0 = () => { try { return view; } catch (e) { return 'match'; } };
  let D = null, busy = false, lastLoad = 0; const LOC = {}; const SAVE = {};

  async function call(action, body) {
    try { const r = await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.assign({ initData: tw.initData, action }, body || {})) }); return await r.json(); }
    catch (e) { return { ok: false, error: 'x' }; }
  }
  async function load() {
    if (busy) return; busy = true;
    const r = await call('list'); busy = false; lastLoad = Date.now();
    if (r && r.ok) { D = r; draw(); }
  }

  const st = document.createElement('style');
  st.textContent = '#mmCard .mmh{font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--mute,#9fb7a8);margin:18px 2px 10px;display:flex;justify-content:space-between;gap:8px}#mmCard .mmh span:last-child{color:var(--lime,#c6ff3d);white-space:nowrap}'
    + '#mmCard .mmc .label{justify-content:space-between}#mmCard .mmc .label b{color:var(--lime,#c6ff3d);font-weight:800}'
    + '#mmCard .res{font-family:"Barlow Condensed",sans-serif;font-weight:800;font-size:48px;font-variant-numeric:tabular-nums;white-space:nowrap}'
    + '#mmCard .sub{text-align:center;margin-top:10px;font-size:14px;color:var(--mute,#9fb7a8)}#mmCard .lv{color:var(--red,#ff5b5b);font-weight:800}#mmCard .pp{font-weight:800;color:var(--ink,#f2f7f3)}#mmCard .pp.g{color:var(--lime,#c6ff3d)}'
    + '#mmCard .trw{margin-top:14px;padding-top:12px;border-top:1px solid var(--line,rgba(255,255,255,.09))}#mmCard .trr{display:grid;grid-template-columns:1fr 44px;gap:8px;align-items:center;margin:7px 0;font-size:14px}'
    + '#mmCard .trk{height:10px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;margin-top:4px}#mmCard .trk i{display:block;height:100%;background:var(--lime,#c6ff3d);border-radius:99px}#mmCard .trr b{text-align:right}'
    + '#mmCard .trs{margin-top:6px;color:var(--mute,#9fb7a8);text-align:center;font-size:13px}#mmCard .btn:disabled{opacity:.6}';
  document.head.appendChild(st);

  function row(m) {
    const t = T(), p = m.pick, loc = LOC[m.id], h = loc ? loc.h : p ? p.h : null, a = loc ? loc.a : p ? p.a : null;
    const open = m.state === 'pre' && m.ko > Date.now() / 1000;
    const ko = new Date(m.ko * 1000).toLocaleTimeString(lg(), { hour: '2-digit', minute: '2-digit' });
    const stp = (side, v) => '<div class="stepper"><button data-mm="' + m.id + '" data-k="' + side + '-">−</button><div class="goals">' + (v == null ? '-' : v) + '</div><button data-mm="' + m.id + '" data-k="' + side + '+">+</button></div>';
    const team = (n, logo) => '<div class="team">' + (logo ? '<img class="crest" src="' + ec(logo) + '" alt="" loading="lazy">' : '') + '<div class="tname">' + ec(n) + '</div></div>';
    const live = m.state === 'in';
    const right = open ? ko + (SAVE[m.id] ? ' · ' + t.save : '') : live ? '<span class="lv">● ' + t.live + '</span>' : m.state === 'post' ? t.ft : t.closed;
    let o = '<div class="label"><span>⚽ ' + ec(m.league) + '</span><b>' + right + '</b></div>';
    o += '<div class="teams">' + team(m.home, m.hl) + (open ? '<div class="vs">VS</div>' : '<div class="res">' + (m.hg == null ? '-' : m.hg) + ' - ' + (m.ag == null ? '-' : m.ag) + '</div>') + team(m.away, m.al) + '</div>';
    if (open) {
      o += '<div class="teams" style="margin-top:12px">' + stp('h', h) + '<div></div>' + stp('a', a) + '</div>';
      if (p) o += '<button class="btn ' + (p.joker ? 'gold' : 'ghost') + '" data-jk="' + m.id + '">' + (p.joker ? '✅ x2' : '🎬 x2') + '</button>';
    } else if (p) {
      o += '<div class="sub">' + t.yours + ' ' + p.h + '-' + p.a + (p.joker ? ' (x2)' : '') + (p.pts != null ? ' · <span class="pp' + (p.pts > 0 ? ' g' : '') + '">+' + p.pts + ' ' + t.pts + '</span>' : '') + '</div>';
      if (p.bt > 0) o += p.cl ? '<div class="sub" style="color:var(--lime,#c6ff3d);font-weight:800">' + t.got(p.bt) + '</div>' : '<button class="btn gold" data-cl="' + m.id + '">' + t.claim(p.bt) + '</button>';
    }
    if (m.tr) {
      const r = m.tr, br = (l, v) => '<div class="trr"><div>' + ec(l) + '<div class="trk"><i style="width:' + v + '%"></i></div></div><b>' + v + '%</b></div>';
      o += '<div class="trw"><div class="label" style="margin-bottom:4px">📊 ' + ec(t.trN) + ' · ' + (r.n || 0) + '</div>';
      o += r.n ? br(m.home, r.h) + br(t.draw, r.d) + br(m.away, r.a) + '<div class="trs">' + r.top.map((x) => x.s + ' ' + x.p + '%').join(' · ') + '</div>' : '<div class="trs">0 ' + t.nb + '</div>';
      const ai = r.ai;
      if (ai) {
        const fav = ai.ph >= ai.pa ? [m.home, ai.ph] : [m.away, ai.pa];
        const why = (Math.abs(ai.ph - ai.pa) < 8 ? t.tight : t.fav(fav[0], fav[1])) + ' · ' + t.goals(ai.g);
        o += '<div class="ai"><div class="label" style="margin-bottom:4px">' + t.pr + '</div><div class="sc">' + ec(m.home) + ' ' + ai.h + ' - ' + ai.a + ' ' + ec(m.away) + '</div><div style="font-size:14px;margin-top:4px">' + ec(why) + '</div></div>';
      }
      o += '</div>';
    } else if (open) o += '<div class="note" style="margin-top:12px">' + ec(t.trN) + '</div><button class="btn gold" style="margin-top:8px" data-tr="' + m.id + '">' + t.tr + '</button>';
    return '<div class="card mmc">' + o + '</div>';
  }
  function html() {
    const t = T(), ms = (D && D.matches) || [];
    if (!ms.length) return '';
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });
    const tomorrowOnly = ms.every((m) => m.day !== today);
    return '<div class="mmh"><span>' + (tomorrowOnly ? t.h2 : t.h) + '</span>' + (D.today_pts > 0 ? '<span>' + t.day(D.today_pts) + '</span>' : '') + '</div>'
      + ms.map(row).join('') + '<div class="note" style="margin:0 8px 14px">' + ec(t.rules) + '<br>' + ec(t.btr) + '</div>';
  }
  function draw() {
    const app = document.getElementById('app'); if (!app) return;
    let c = document.getElementById('mmCard');
    if (view0() !== 'match' || !D || !(D.matches || []).length) { if (c) c.remove(); return; }
    const anchor = [...app.querySelectorAll('.card.match')].pop();
    if (!anchor) return;
    if (!c || !c.isConnected) { c = document.createElement('div'); c.id = 'mmCard'; }
    if (c.previousElementSibling !== anchor) anchor.insertAdjacentElement('afterend', c);
    c.innerHTML = html();
  }
  // the game redraws the screen often: the card comes back right after
  const app = document.getElementById('app');
  if (app) new MutationObserver(() => { if (!document.getElementById('mmCard') || !document.getElementById('mmCard').isConnected) draw(); }).observe(app, { childList: true });

  const timers = {};
  document.addEventListener('click', async (e) => {
    const b = e.target.closest && e.target.closest('#mmCard [data-mm], #mmCard [data-jk], #mmCard [data-cl], #mmCard [data-tr]'); if (!b || !D) return;
    e.preventDefault(); e.stopPropagation(); hap();
    if (b.dataset.mm) {
      const id = b.dataset.mm, m = D.matches.find((x) => x.id === id); if (!m) return;
      const cur = LOC[id] || { h: m.pick ? m.pick.h : 0, a: m.pick ? m.pick.a : 0 };
      const k = b.dataset.k, side = k[0], d = k[1] === '+' ? 1 : -1;
      cur[side] = Math.max(0, Math.min(20, (cur[side] == null ? 0 : cur[side]) + d)); LOC[id] = cur; SAVE[id] = false; draw();
      clearTimeout(timers[id]);
      timers[id] = setTimeout(async () => {
        const r = await call('pick', { id, h: cur.h, a: cur.a });
        if (r && r.ok) { D = r; delete LOC[id]; SAVE[id] = true; hap('success'); draw(); setTimeout(() => { SAVE[id] = false; draw(); }, 2500); }
        else { delete LOC[id]; say(T()[r && r.error] || T().err); load(); }
      }, 700);
      return;
    }
    const tr = b.dataset.tr, cl = b.dataset.cl, id = cl || tr || b.dataset.jk, m = D.matches.find((x) => x.id === id); if (!m) return;
    if (tr) { if (m.tr || b.disabled) return; b.disabled = true; }
    else if (cl) { if (!m.pick || m.pick.cl || b.disabled) return; b.disabled = true; }
    else {
      if (m.pick && m.pick.joker) return;
      let ok = false; try { ok = await new Promise((res) => tw.showConfirm(T().jokerAsk, res)); } catch (x) { ok = true; }
      if (!ok) return;
    }
    try {
      if (!window.Adsgram) await new Promise((ok2, ko) => { const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; s.onload = ok2; s.onerror = ko; document.head.appendChild(s); });
      let blk = '51754'; try { blk = DS_REWARD; } catch (x) {}
      await window.Adsgram.init({ blockId: blk }).show();
    } catch (x) { b.disabled = false; say(T().vid); return; }
    const r = await call(tr ? 'trend' : cl ? 'claim' : 'joker', { id });
    if (r && r.ok) { D = r; hap('success'); draw(); if (r.got) say(T().got(r.got)); } else { say(T()[r && r.error] || T().err); load(); }
  }, true);

  load();
  setInterval(() => { if (!document.hidden && Date.now() - lastLoad > 60000) load(); }, 15000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) load(); });
})();
