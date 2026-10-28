// 27 oct 2026 (Jeremy): "More matches today" in Daily Score. Besides the match of the day (unchanged), up to 8 more matches of the big
// leagues, one prediction per match (3 pts exact score, 1 pt right result), and one Joker a day (x2 on one match, unlocked by a video).
// Server: Supabase function ds-multi (SQL ds_mm_*), the points count in every ranking and in the weekly $BATON prizes.
// 27 oct 2026 (17h56): every settled prediction wins $BATON (1,000 exact / 250 result / 50 missed, x2 Joker), collected with a rewarded video.
// Telegram only (the player is identified by the initData); the card sits right under the match of the day.
(() => {
  const tw = window.Telegram && Telegram.WebApp;
  if (!tw || !tw.initData) return;
  const FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/ds-multi';
  const L = {
    en: { h: '⚽ More matches today', h2: '⚽ More matches tomorrow', rules: '3 pts exact score · 1 pt right result · 🎬 x2 on every match with a video', save: 'Saved ✅', joker: '🃏 x2', jokerOn: '🃏 Joker x2', jokerAsk: 'Watch a short video to put your Joker (x2) on this match?', live: 'LIVE', ft: 'Final', yours: 'You', pts: 'pts', closed: 'Started', err: 'Error, try again', started: 'This match has started', nopick: 'Make your prediction first', jokerused: 'Your Joker is already used on a match that started', vid: 'No video available right now, try again later', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON already won by all players', won: (n) => n.toLocaleString(lg()) + ' $BATON won on Daily Score', bl1: 'Your $BATON are worth real money', bl2: '⚽ Exact score +1,000 · ⭐ Match of the day x2 · 🏆 Weekly contest up to 100,000 · 👥 Friend +10,000. Swap them for USDT on Pass The Baton', bl3: 'Open', bo1: '🎬 Points + $BATON bonus', bo2: (n) => 'Watch a video: x' + n + '', bo3: '🔥 Max bonus x4', bo4: 'Your points and $BATON on the match of the day are multiplied, up to x4', md: '⭐ Match of the day', mdx: '⭐ Match of the day: points and $BATON x2', val: '✅ Confirm my prediction', edit: '✏️ Update my prediction', done: '✅ Prediction saved', tr: '📊 See the trend + the prono · 🎬', trN: 'What everyone played, and the prono from the odds', pr: '🤖 Prono', fav: (t, p) => '' + t + ' favourite (' + p + '%)', tight: 'Tight match', goals: (g) => '~' + g + ' goals expected', draw: 'Draw', nb: 'players', claim: (n) => '🎬 Collect +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON won ✅', claimed: 'Already collected', btr: '💰 $BATON every match: 1,000 exact score · 250 right result · 50 missed', day: (n) => '+' + n + ' pts today' },
    fr: { h: '⚽ Plus de matchs aujourd\'hui', h2: '⚽ Plus de matchs demain', rules: '3 pts score exact · 1 pt bon résultat · 🎬 x2 sur chaque match avec une vidéo', save: 'Enregistré ✅', joker: '🃏 x2', jokerOn: '🃏 Joker x2', jokerAsk: 'Regarder une courte vidéo pour mettre ton Joker (x2) sur ce match ?', live: 'EN DIRECT', ft: 'Terminé', yours: 'Toi', pts: 'pts', closed: 'Commencé', err: 'Erreur, réessaie', started: 'Ce match a commencé', nopick: 'Fais d\'abord ton prono', jokerused: 'Ton Joker est déjà sur un match commencé', vid: 'Pas de vidéo dispo pour le moment, réessaie plus tard', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON déjà gagnés par tous les joueurs', won: (n) => n.toLocaleString(lg()) + ' $BATON gagnés sur Daily Score', bl1: 'Tes $BATON valent de l\'argent réel', bl2: '⚽ Score exact +1 000 · ⭐ Match du jour x2 · 🏆 Concours de la semaine jusqu\'à 100 000 · 👥 Ami invité +10 000. Échange-les contre des USDT sur Pass The Baton', bl3: 'Ouvrir', bo1: '🎬 Bonus points + $BATON', bo2: (n) => 'Regarde une vidéo : x' + n + '', bo3: '🔥 Bonus max x4', bo4: 'Tes points et tes $BATON sur le match du jour sont multipliés, jusqu\'à x4', md: '⭐ Match du jour', mdx: '⭐ Match du jour : points et $BATON x2', val: '✅ Valider mon prono', edit: '✏️ Modifier mon prono', done: '✅ Prono validé', tr: '📊 Voir la tendance + le prono · 🎬', trN: 'Ce que tout le monde a joué, et le prono des cotes', pr: '🤖 Prono', fav: (t, p) => '' + t + ' favori (' + p + ' %)', tight: 'Match serré', goals: (g) => '~' + g + ' buts attendus', draw: 'Nul', nb: 'joueurs', claim: (n) => '🎬 Récupérer +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON gagnés ✅', claimed: 'Déjà récupéré', btr: '💰 Des $BATON à chaque match : 1 000 score exact · 250 bon résultat · 50 raté', day: (n) => '+' + n + ' pts aujourd\'hui' },
    es: { h: '⚽ Más partidos hoy', h2: '⚽ Más partidos mañana', rules: '3 pts resultado exacto · 1 pt acierto · 🎬 x2 en cada partido con un vídeo', save: 'Guardado ✅', joker: '🃏 x2', jokerOn: '🃏 Comodín x2', jokerAsk: '¿Ver un vídeo corto para poner tu Comodín (x2) en este partido?', live: 'EN VIVO', ft: 'Final', yours: 'Tú', pts: 'pts', closed: 'Empezado', err: 'Error, inténtalo de nuevo', started: 'Este partido ha empezado', nopick: 'Haz primero tu pronóstico', jokerused: 'Tu Comodín ya está en un partido empezado', vid: 'No hay vídeo disponible, inténtalo más tarde', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON ya ganados por todos los jugadores', won: (n) => n.toLocaleString(lg()) + ' $BATON ganados en Daily Score', bl1: 'Tus $BATON valen dinero real', bl2: '⚽ Resultado exacto +1.000 · ⭐ Partido del día x2 · 🏆 Concurso semanal hasta 100.000 · 👥 Amigo +10.000. Cámbialos por USDT en Pass The Baton', bl3: 'Abrir', bo1: '🎬 Bonus puntos + $BATON', bo2: (n) => 'Mira un vídeo: x' + n + '', bo3: '🔥 Bonus máximo x4', bo4: 'Tus puntos y $BATON del partido del día se multiplican, hasta x4', md: '⭐ Partido del día', mdx: '⭐ Partido del día: puntos y $BATON x2', val: '✅ Validar mi pronóstico', edit: '✏️ Cambiar mi pronóstico', done: '✅ Pronóstico guardado', tr: '📊 Ver la tendencia + el pronóstico · 🎬', trN: 'Lo que todos jugaron, y el pronóstico de las cuotas', pr: '🤖 Pronóstico', fav: (t, p) => '' + t + ' favorito (' + p + ' %)', tight: 'Partido igualado', goals: (g) => '~' + g + ' goles esperados', draw: 'Empate', nb: 'jugadores', claim: (n) => '🎬 Cobrar +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON ganados ✅', claimed: 'Ya cobrado', btr: '💰 $BATON en cada partido: 1.000 resultado exacto · 250 acierto · 50 fallo', day: (n) => '+' + n + ' pts hoy' },
    pt: { h: '⚽ Mais jogos hoje', h2: '⚽ Mais jogos amanhã', rules: '3 pts placar exato · 1 pt resultado certo · 🎬 x2 em cada jogo com um vídeo', save: 'Salvo ✅', joker: '🃏 x2', jokerOn: '🃏 Coringa x2', jokerAsk: 'Ver um vídeo curto para colocar seu Coringa (x2) neste jogo?', live: 'AO VIVO', ft: 'Final', yours: 'Você', pts: 'pts', closed: 'Começou', err: 'Erro, tente de novo', started: 'Este jogo começou', nopick: 'Faça seu palpite primeiro', jokerused: 'Seu Coringa já está num jogo que começou', vid: 'Nenhum vídeo disponível agora, tente mais tarde', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON já ganhos por todos os jogadores', won: (n) => n.toLocaleString(lg()) + ' $BATON ganhos no Daily Score', bl1: 'Seus $BATON valem dinheiro real', bl2: '⚽ Placar exato +1.000 · ⭐ Jogo do dia x2 · 🏆 Concurso semanal até 100.000 · 👥 Amigo +10.000. Troque por USDT no Pass The Baton', bl3: 'Abrir', bo1: '🎬 Bônus pontos + $BATON', bo2: (n) => 'Veja um vídeo: x' + n + '', bo3: '🔥 Bônus máximo x4', bo4: 'Seus pontos e $BATON do jogo do dia são multiplicados, até x4', md: '⭐ Jogo do dia', mdx: '⭐ Jogo do dia: pontos e $BATON x2', val: '✅ Validar meu palpite', edit: '✏️ Mudar meu palpite', done: '✅ Palpite salvo', tr: '📊 Ver a tendência + o palpite · 🎬', trN: 'O que todos jogaram, e o palpite das odds', pr: '🤖 Palpite', fav: (t, p) => '' + t + ' favorito (' + p + '%)', tight: 'Jogo equilibrado', goals: (g) => '~' + g + ' gols esperados', draw: 'Empate', nb: 'jogadores', claim: (n) => '🎬 Resgatar +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON ganhos ✅', claimed: 'Já resgatado', btr: '💰 $BATON em cada jogo: 1.000 placar exato · 250 resultado certo · 50 errado', day: (n) => '+' + n + ' pts hoje' },
    de: { h: '⚽ Mehr Spiele heute', h2: '⚽ Mehr Spiele morgen', rules: '3 Pkt. exaktes Ergebnis · 1 Pkt. Tendenz · 🎬 x2 auf jedes Spiel mit einem Video', save: 'Gespeichert ✅', joker: '🃏 x2', jokerOn: '🃏 Joker x2', jokerAsk: 'Kurzes Video ansehen, um deinen Joker (x2) auf dieses Spiel zu setzen?', live: 'LIVE', ft: 'Ende', yours: 'Du', pts: 'Pkt.', closed: 'Begonnen', err: 'Fehler, versuch es nochmal', started: 'Dieses Spiel hat begonnen', nopick: 'Gib zuerst deinen Tipp ab', jokerused: 'Dein Joker ist schon auf einem laufenden Spiel', vid: 'Gerade kein Video verfügbar, versuch es später', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON schon von allen Spielern gewonnen', won: (n) => n.toLocaleString(lg()) + ' $BATON auf Daily Score gewonnen', bl1: 'Deine $BATON sind echtes Geld wert', bl2: '⚽ Exaktes Ergebnis +1.000 · ⭐ Spiel des Tages x2 · 🏆 Wochenwettbewerb bis 100.000 · 👥 Freund +10.000. Tausche sie in Pass The Baton gegen USDT', bl3: 'Öffnen', bo1: '🎬 Bonus Punkte + $BATON', bo2: (n) => 'Video ansehen: x' + n + '', bo3: '🔥 Max. Bonus x4', bo4: 'Deine Punkte und $BATON beim Spiel des Tages werden multipliziert, bis x4', md: '⭐ Spiel des Tages', mdx: '⭐ Spiel des Tages: Punkte und $BATON x2', val: '✅ Tipp bestätigen', edit: '✏️ Tipp ändern', done: '✅ Tipp gespeichert', tr: '📊 Trend + Tipp ansehen · 🎬', trN: 'Was alle getippt haben, und der Tipp aus den Quoten', pr: '🤖 Tipp', fav: (t, p) => '' + t + ' Favorit (' + p + ' %)', tight: 'Enges Spiel', goals: (g) => '~' + g + ' Tore erwartet', draw: 'Remis', nb: 'Spieler', claim: (n) => '🎬 Abholen +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON gewonnen ✅', claimed: 'Schon abgeholt', btr: '💰 $BATON bei jedem Spiel: 1.000 exaktes Ergebnis · 250 Tendenz · 50 daneben', day: (n) => '+' + n + ' Pkt. heute' },
    it: { h: '⚽ Altre partite oggi', h2: '⚽ Altre partite domani', rules: '3 pt risultato esatto · 1 pt esito giusto · 🎬 x2 su ogni partita con un video', save: 'Salvato ✅', joker: '🃏 x2', jokerOn: '🃏 Jolly x2', jokerAsk: 'Guardare un breve video per mettere il tuo Jolly (x2) su questa partita?', live: 'LIVE', ft: 'Finale', yours: 'Tu', pts: 'pt', closed: 'Iniziata', err: 'Errore, riprova', started: 'Questa partita è iniziata', nopick: 'Fai prima il tuo pronostico', jokerused: 'Il tuo Jolly è già su una partita iniziata', vid: 'Nessun video disponibile ora, riprova più tardi', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON già vinti da tutti i giocatori', won: (n) => n.toLocaleString(lg()) + ' $BATON vinti su Daily Score', bl1: 'I tuoi $BATON valgono soldi veri', bl2: '⚽ Risultato esatto +1.000 · ⭐ Partita del giorno x2 · 🏆 Concorso settimanale fino a 100.000 · 👥 Amico +10.000. Cambiali in USDT su Pass The Baton', bl3: 'Apri', bo1: '🎬 Bonus punti + $BATON', bo2: (n) => 'Guarda un video: x' + n + '', bo3: '🔥 Bonus massimo x4', bo4: 'I tuoi punti e $BATON della partita del giorno sono moltiplicati, fino a x4', md: '⭐ Partita del giorno', mdx: '⭐ Partita del giorno: punti e $BATON x2', val: '✅ Conferma il pronostico', edit: '✏️ Modifica il pronostico', done: '✅ Pronostico salvato', tr: '📊 Vedi la tendenza + il pronostico · 🎬', trN: 'Cosa hanno giocato tutti, e il pronostico delle quote', pr: '🤖 Pronostico', fav: (t, p) => '' + t + ' favorita (' + p + '%)', tight: 'Partita equilibrata', goals: (g) => '~' + g + ' gol attesi', draw: 'Pareggio', nb: 'giocatori', claim: (n) => '🎬 Riscuoti +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON vinti ✅', claimed: 'Già riscossi', btr: '💰 $BATON a ogni partita: 1.000 risultato esatto · 250 esito giusto · 50 sbagliato', day: (n) => '+' + n + ' pt oggi' },
    ar: { h: '⚽ مباريات أخرى اليوم', h2: '⚽ مباريات أخرى غدًا', rules: '3 نقاط للنتيجة الدقيقة · نقطة للنتيجة الصحيحة · 🎬 x2 على كل مباراة مع فيديو', save: 'تم الحفظ ✅', joker: '🃏 x2', jokerOn: '🃏 جوكر x2', jokerAsk: 'شاهد فيديو قصيرًا لوضع الجوكر (x2) على هذه المباراة؟', live: 'مباشر', ft: 'انتهت', yours: 'أنت', pts: 'نقاط', closed: 'بدأت', err: 'خطأ، حاول مجددًا', started: 'بدأت هذه المباراة', nopick: 'قدّم توقعك أولًا', jokerused: 'الجوكر مستخدم في مباراة بدأت', vid: 'لا يوجد فيديو الآن، حاول لاحقًا', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON ربحها جميع اللاعبين', won: (n) => n.toLocaleString(lg()) + ' $BATON ربحتها في Daily Score', bl1: '$BATON تساوي مالًا حقيقيًا', bl2: '⚽ النتيجة الدقيقة \u200e+1,000 · ⭐ مباراة اليوم ×2 · 🏆 مسابقة الأسبوع حتى 100,000 · 👥 صديق \u200e+10,000. استبدلها بـ USDT في Pass The Baton', bl3: 'افتح', bo1: '🎬 مكافأة النقاط + $BATON', bo2: (n) => 'شاهد فيديو: ×' + n + '', bo3: '🔥 أقصى مكافأة ×4', bo4: 'تتضاعف نقاطك و$BATON في مباراة اليوم حتى ×4', md: '⭐ مباراة اليوم', mdx: '⭐ مباراة اليوم: النقاط و$BATON ×2', val: '✅ أكّد توقعي', edit: '✏️ عدّل توقعي', done: '✅ تم حفظ التوقع', tr: '📊 شاهد التوجه + التوقع · 🎬', trN: 'ما لعبه الجميع، وتوقع الاحتمالات', pr: '🤖 التوقع', fav: (t, p) => '' + t + ' المرشح (' + p + '%)', tight: 'مباراة متقاربة', goals: (g) => '~' + g + ' أهداف متوقعة', draw: 'تعادل', nb: 'لاعبين', claim: (n) => '🎬 استلم +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON ربحت ✅', claimed: 'تم الاستلام', btr: '💰 \u200f$BATON في كل مباراة: 1,000 للنتيجة الدقيقة · 250 للنتيجة الصحيحة · 50 للخطأ', day: (n) => '\u200e+' + n + ' نقاط اليوم' },
    tr: { h: '⚽ Bugün daha fazla maç', h2: '⚽ Yarın daha fazla maç', rules: 'Tam skor 3 puan · doğru sonuç 1 puan · 🎬 her maçta video ile x2', save: 'Kaydedildi ✅', joker: '🃏 x2', jokerOn: '🃏 Joker x2', jokerAsk: 'Jokerini (x2) bu maça koymak için kısa bir video izle?', live: 'CANLI', ft: 'Bitti', yours: 'Sen', pts: 'puan', closed: 'Başladı', err: 'Hata, tekrar dene', started: 'Bu maç başladı', nopick: 'Önce tahminini yap', jokerused: 'Jokerin zaten başlamış bir maçta', vid: 'Şu an video yok, sonra tekrar dene', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON tüm oyuncular tarafından kazanıldı', won: (n) => n.toLocaleString(lg()) + ' $BATON Daily Score\'da kazanıldı', bl1: '$BATON\'ların gerçek para değerinde', bl2: '⚽ Tam skor +1.000 · ⭐ Günün maçı x2 · 🏆 Haftalık yarışma 100.000\'e kadar · 👥 Arkadaş +10.000. Pass The Baton\'da USDT ile değiştir', bl3: 'Aç', bo1: '🎬 Puan + $BATON bonusu', bo2: (n) => 'Video izle: x' + n + '', bo3: '🔥 Maksimum bonus x4', bo4: 'Günün maçındaki puanların ve $BATON\'ların x4\'e kadar katlanır', md: '⭐ Günün maçı', mdx: '⭐ Günün maçı: puan ve $BATON x2', val: '✅ Tahminimi onayla', edit: '✏️ Tahminimi değiştir', done: '✅ Tahmin kaydedildi', tr: '📊 Eğilim + tahmini gör · 🎬', trN: 'Herkesin oynadığı ve oranlara göre tahmin', pr: '🤖 Tahmin', fav: (t, p) => '' + t + ' favori (%' + p + ')', tight: 'Çekişmeli maç', goals: (g) => '~' + g + ' gol bekleniyor', draw: 'Beraberlik', nb: 'oyuncu', claim: (n) => '🎬 Al +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON kazanıldı ✅', claimed: 'Zaten alındı', btr: '💰 Her maçta $BATON: tam skor 1.000 · doğru sonuç 250 · yanlış 50', day: (n) => 'Bugün +' + n + ' puan' },
    ru: { h: '⚽ Ещё матчи сегодня', h2: '⚽ Ещё матчи завтра', rules: '3 очка за точный счёт · 1 очко за исход · 🎬 x2 на каждый матч за видео', save: 'Сохранено ✅', joker: '🃏 x2', jokerOn: '🃏 Джокер x2', jokerAsk: 'Посмотреть короткое видео, чтобы поставить Джокер (x2) на этот матч?', live: 'LIVE', ft: 'Финал', yours: 'Ты', pts: 'очк.', closed: 'Начался', err: 'Ошибка, попробуй ещё', started: 'Матч уже начался', nopick: 'Сначала сделай прогноз', jokerused: 'Джокер уже стоит на начавшемся матче', vid: 'Сейчас нет видео, попробуй позже', all: (n) => '🌍 ' + n.toLocaleString(lg()) + ' $BATON уже выиграли все игроки', won: (n) => n.toLocaleString(lg()) + ' $BATON выиграно в Daily Score', bl1: 'Твои $BATON стоят реальных денег', bl2: '⚽ Точный счёт +1 000 · ⭐ Матч дня x2 · 🏆 Конкурс недели до 100 000 · 👥 Друг +10 000. Обменяй их на USDT в Pass The Baton', bl3: 'Открыть', bo1: '🎬 Бонус очков + $BATON', bo2: (n) => 'Посмотри видео: x' + n + '', bo3: '🔥 Максимальный бонус x4', bo4: 'Твои очки и $BATON за матч дня умножаются, до x4', md: '⭐ Матч дня', mdx: '⭐ Матч дня: очки и $BATON x2', val: '✅ Подтвердить прогноз', edit: '✏️ Изменить прогноз', done: '✅ Прогноз сохранён', tr: '📊 Тенденция + прогноз · 🎬', trN: 'Что выбрали все, и прогноз по коэффициентам', pr: '🤖 Прогноз', fav: (t, p) => '' + t + ' фаворит (' + p + '%)', tight: 'Равный матч', goals: (g) => '~' + g + ' гола ожидается', draw: 'Ничья', nb: 'игроков', claim: (n) => '🎬 Забрать +' + n.toLocaleString(lg()) + ' $BATON', got: (n) => '+' + n.toLocaleString(lg()) + ' $BATON получено ✅', claimed: 'Уже получено', btr: '💰 $BATON за каждый матч: 1 000 точный счёт · 250 исход · 50 мимо', day: (n) => '+' + n + ' очк. сегодня' },
  };
  const lg = () => { let l = 'en'; try { l = String(lang || 'en').slice(0, 2); } catch (e) {} return L[l] ? l : 'en'; };
  // 28 oct 2026 (7h21, Jeremy): no more $BATON on Daily Score (server ds_gains_on): the texts without $BATON
  const NOB = { en: { bo1: '🎬 Points bonus', bo4: 'Your points on the match of the day are multiplied, up to x4', mdx: '⭐ Match of the day: points x2' },
    fr: { bo1: '🎬 Bonus de points', bo4: 'Tes points sur le match du jour sont multipliés, jusqu\'à x4', mdx: '⭐ Match du jour : points x2' },
    es: { bo1: '🎬 Bonus de puntos', bo4: 'Tus puntos en el partido del día se multiplican, hasta x4', mdx: '⭐ Partido del día: puntos x2' },
    pt: { bo1: '🎬 Bônus de pontos', bo4: 'Seus pontos no jogo do dia são multiplicados, até x4', mdx: '⭐ Jogo do dia: pontos x2' },
    de: { bo1: '🎬 Punktebonus', bo4: 'Deine Punkte im Spiel des Tages werden multipliziert, bis x4', mdx: '⭐ Spiel des Tages: Punkte x2' },
    it: { bo1: '🎬 Bonus punti', bo4: 'I tuoi punti sulla partita del giorno sono moltiplicati, fino a x4', mdx: '⭐ Partita del giorno: punti x2' },
    ar: { bo1: '🎬 مكافأة النقاط', bo4: 'تتضاعف نقاطك في مباراة اليوم حتى ×4', mdx: '⭐ مباراة اليوم: النقاط ×2' },
    tr: { bo1: '🎬 Puan bonusu', bo4: 'Günün maçındaki puanların çarpılır, x4\'e kadar', mdx: '⭐ Günün maçı: puanlar x2' },
    ru: { bo1: '🎬 Бонус очков', bo4: 'Твои очки за матч дня умножаются, до x4', mdx: '⭐ Матч дня: очки x2' } };
  const T = () => (D && D.gains_on === false) ? Object.assign({}, L[lg()], NOB[lg()] || NOB.en) : L[lg()];
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
    const r = await call('list'); busy = false; lastLoad = Date.now(); if (r && r.dstLeft != null) window.mmDstLeft = r.dstLeft;
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
    const t = T(), p = m.pick, loc = LOC[m.id], h = loc ? loc.h : p ? p.h : 1, a = loc ? loc.a : p ? p.a : 1;
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
      const dirty = !p || (loc && (loc.h !== p.h || loc.a !== p.a));
      o += dirty ? '<button class="btn go" data-val="' + m.id + '">' + (p ? t.edit : t.val) + '</button>' : '<div class="sub" style="color:var(--lime,#c6ff3d);font-weight:800">' + t.done + '</div>';
      /* 28 oct 2026 (17h, Jeremy): no more Joker x2 */
    } else if (p) {
      o += '<div class="sub">' + t.yours + ' ' + p.h + '-' + p.a + '' + (p.pts != null ? ' · <span class="pp' + (p.pts > 0 ? ' g' : '') + '">+' + p.pts + ' ' + t.pts + '</span>' : '') + '</div>';
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
    const mn = (D && D.main) || [];
    // 27 oct 2026 (19h49, Jeremy): the small Baton banner, with the $BATON won on Daily Score, links to Pass The Baton (always shown)
    const ban = () => (D.gains_on !== false && D.dsall > 0 ? '<div class="igban" data-sh="1" style="cursor:pointer;padding:6px 10px 6px 12px;background:linear-gradient(135deg,rgba(47,141,255,.22),rgba(30,90,200,.10));border-color:rgba(80,160,255,.5)"><div style="min-width:0"><b style="font-size:13px">' + ec(S2().all(Number(D.dsall).toLocaleString(lg()))) + '</b></div><span class="iggo" style="padding:4px 10px">›</span></div>' : '');
    if (!ms.length && !mn.length) return '<div style="margin:6px 0 14px">' + ban() + '</div>';
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });
    const tomorrowOnly = ms.every((m) => m.day !== today);
    return (ms.length ? '<div class="mmh"><span>' + (tomorrowOnly ? t.h2 : t.h) + '</span>' + (D.today_pts > 0 ? '<span>' + t.day(D.today_pts) + '</span>' : '') + '</div>' : '<div style="height:6px"></div>')
      + ban()
      + [].map((x) => '<div class="card prem"><div class="label">' + t.md + '</div><div class="teams"><div class="tname" style="text-align:center">' + ec(x.home) + '</div><div class="res">' + (x.hg == null ? '-' : x.hg) + ' - ' + (x.ag == null ? '-' : x.ag) + '</div><div class="tname" style="text-align:center">' + ec(x.away) + '</div></div>'
        + '<div class="sub">' + t.yours + ' ' + x.ph + '-' + x.pa + ' · <span class="pp' + (x.pts > 0 ? ' g' : '') + '">+' + x.pts + ' ' + t.pts + '</span></div>'
        + (x.cl ? '<div class="sub" style="color:var(--lime,#c6ff3d);font-weight:800">' + t.got(x.bt) + '</div>' : '<button class="btn gold" data-cm="' + x.day + '">' + t.claim(x.bt) + '</button>') + '</div>').join('')
      + ms.map(row).join('') + '<div class="note" style="margin:0 8px 14px">' + ec(String(t.rules).split(' · 🎬')[0]) + '</div>';  /* 28 oct 2026 (16h57, Jeremy): no more x2 on the match of the day, and no $BATON on the extra matches */
  }
  function draw() {
    const app = document.getElementById('app'); if (!app) return;
    let c = document.getElementById('mmCard');
    if (view0() !== 'match' || !D) { if (c) c.remove(); return; }
    const anchor = [...app.querySelectorAll('.card.match')].pop();
    if (!anchor) return;
    if (!c || !c.isConnected) { c = document.createElement('div'); c.id = 'mmCard'; }
    // the extra matches go after the match of the day AND its trend + AI card (the card whose label starts with 📊)
    const nx = (n) => { let x = n.nextElementSibling; if (x === c) x = x.nextElementSibling; return x; };
    let at = anchor;
    // also its stats card (details.pre) and the vote for tomorrow's match of the day (🗳️)
    while (nx(at) && nx(at).classList.contains('card') && (nx(at).classList.contains('pre') || /^(📊|🗳)/.test(((nx(at).querySelector('.label') || {}).textContent || '').trim()))) at = nx(at);
    if (c.previousElementSibling !== at) at.insertAdjacentElement('afterend', c);
    // 27 oct 2026 (20h53, Jeremy): the video bonus of the match of the day (x1.5, x2 ... up to x4) at the bottom of its card
    const bo = null /* 28 oct 2026 (17h, Jeremy): no more video bonus */, bt0 = T();
    let bx = document.getElementById('mmBoost');
    if (bo && !bx) { bx = document.createElement('div'); bx.id = 'mmBoost'; bx.style.cssText = 'position:relative;z-index:1;margin-top:12px;padding:12px;border-radius:14px;background:rgba(255,200,61,.10);border:1px solid rgba(255,200,61,.35)'; anchor.appendChild(bx); }
    if (!bo && bx) bx.remove();
    if (bo && bx) { const mu = Number(bo.mult || 1), nx2 = Math.min(4, mu + 0.5), f = (v) => String(v).replace('.', lg() === 'en' ? '.' : ',');
      const k2 = mu + lg(); if (bx.dataset.k !== k2) { bx.dataset.k = k2;
        bx.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="font-size:14px">' + ec(bt0.bo1) + '</b><b style="font-family:\'Barlow Condensed\',sans-serif;font-size:26px;color:var(--gold,#ffc83d)">x' + f(mu) + '</b></div>'
          + '<div class="note" style="margin:4px 0 0;text-align:left">' + ec(bt0.bo4) + '</div>'
          + (mu < 4 ? '<button class="btn gold" data-bo="1" style="margin-top:10px">' + ec(bt0.bo2(f(nx2))) + '</button>' : '<div style="margin-top:8px;font-weight:800;color:var(--gold,#ffc83d)">' + ec(bt0.bo3) + '</div>'); } }
    // 27 oct 2026 (23h27, Jeremy): "Invite a friend" with what it pays, right under the bonus of the match of the day
    const IV = { en: ['👥 Invite a friend: +3,000 $BATON', 'when he makes his first prediction', '📣 Invite a friend', 'Guess the score of the match of the day with me and win $BATON (real money) ⚽'],
      fr: ['👥 Invite un ami : +3 000 $BATON', 'dès qu\'il fait son premier prono', '📣 Inviter un ami', 'Devine le score du match du jour avec moi et gagne des $BATON (de l\'argent réel) ⚽'],
      es: ['👥 Invita a un amigo: +3.000 $BATON', 'cuando haga su primer pronóstico', '📣 Invitar a un amigo', 'Adivina el resultado del partido del día conmigo y gana $BATON (dinero real) ⚽'],
      pt: ['👥 Convide um amigo: +3.000 $BATON', 'quando ele fizer o primeiro palpite', '📣 Convidar um amigo', 'Adivinhe o placar do jogo do dia comigo e ganhe $BATON (dinheiro real) ⚽'],
      de: ['👥 Lade einen Freund ein: +3.000 $BATON', 'sobald er seinen ersten Tipp abgibt', '📣 Freund einladen', 'Tippe mit mir das Ergebnis des Spiels des Tages und gewinne $BATON (echtes Geld) ⚽'],
      it: ['👥 Invita un amico: +3.000 $BATON', 'quando fa il suo primo pronostico', '📣 Invita un amico', 'Indovina il risultato della partita del giorno con me e vinci $BATON (soldi veri) ⚽'],
      ar: ['👥 ادعُ صديقًا: \u200e+3,000 $BATON', 'عندما يقدّم توقعه الأول', '📣 ادعُ صديقًا', 'خمّن نتيجة مباراة اليوم معي واربح $BATON (مال حقيقي) ⚽'],
      tr: ['👥 Bir arkadaşını davet et: +3.000 $BATON', 'ilk tahminini yaptığında', '📣 Arkadaş davet et', 'Günün maçının skorunu benimle tahmin et ve $BATON kazan (gerçek para) ⚽'],
      ru: ['👥 Пригласи друга: +3 000 $BATON', 'когда он сделает первый прогноз', '📣 Пригласить друга', 'Угадай счёт матча дня вместе со мной и выигрывай $BATON (реальные деньги) ⚽'] };
    if (D.ban_on === false) { const o = document.getElementById('mmInv');  /* 28 oct 2026 (16h59, Jeremy): invited friend = 3 000 $BATON */ if (o) o.remove(); } else {  // 28 oct 2026: no reward to show
    let iv = document.getElementById('mmInv');
    if (!iv || !iv.isConnected) {
      iv = document.createElement('div'); iv.id = 'mmInv';
      iv.style.cssText = 'position:relative;z-index:1;margin-top:10px;padding:12px;border-radius:14px;background:rgba(47,141,255,.12);border:1px solid rgba(80,160,255,.45)';
      anchor.appendChild(iv);
    }
    const ivx = IV[lg()] || IV.en;
    if (iv.dataset.k !== lg()) { iv.dataset.k = lg();
      iv.innerHTML = '<b style="font-size:14px">' + ec(ivx[0]) + '</b><div class="note" style="margin:2px 0 0;text-align:left">' + ec(ivx[1]) + '</div><button class="btn go" type="button" style="margin-top:10px">' + ec(ivx[2]) + '</button>';
      iv.querySelector('button').onclick = (e) => { e.stopPropagation(); hap();
        const uid = tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.id; if (!uid) return;
        const u = 'https://t.me/share/url?url=' + encodeURIComponent('https://t.me/DailyScorefootbot?start=ref_' + uid) + '&text=' + encodeURIComponent(ivx[3]);
        try { tw.openTelegramLink(u); } catch (x) { location.href = u; } }; }
    }
    // the match of the day is worth double: a small gold line on its card
    { const om = anchor.querySelector('.mdx'); if (om) om.remove(); } if (false) { const x = document.createElement('div'); x.className = 'mdx'; x.style.cssText = 'position:relative;z-index:1;margin:-4px 0 10px;font-size:13px;font-weight:800;color:var(--gold,#ffc83d)'; x.textContent = T().mdx; const lb = anchor.querySelector('.label'); if (lb) lb.insertAdjacentElement('afterend', x); else anchor.prepend(x); }
    c.innerHTML = html();
  }
  // the game redraws the screen often: the card comes back right after
  const app = document.getElementById('app');
  if (app) new MutationObserver(() => { if (!document.getElementById('mmCard') || !document.getElementById('mmCard').isConnected) draw(); }).observe(app, { childList: true });

  const timers = {};
  document.addEventListener('click', async (e) => {
    const b = e.target.closest && e.target.closest('#mmCard [data-mm], #mmCard [data-jk], #mmCard [data-cl], #mmCard [data-tr], #mmCard [data-val], #mmCard [data-cm], #mmCard [data-bl], #mmCard [data-sh], #mmBoost [data-bo]'); if (!b || !D) return;
    e.preventDefault(); e.stopPropagation(); hap();
    if (b.dataset.sh) { openSheet(); return; }
    if (b.dataset.bo) {
      if (b.disabled) return; b.disabled = true;
      try {
        if (!window.Adsgram) await new Promise((ok2, ko) => { const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; s.onload = ok2; s.onerror = ko; document.head.appendChild(s); });
        let blk = '51754'; try { blk = DS_REWARD; } catch (x) {}
        const rr = await window.Adsgram.init({ blockId: blk }).show();
        if (rr && rr.done === false) { b.disabled = false; return; }
      } catch (x) { b.disabled = false; say(T().vid); return; }
      const r = await call('boost', {});
      if (r && r.ok) { D = r; hap('success'); const bxx = document.getElementById('mmBoost'); if (bxx) bxx.dataset.k = ''; draw(); } else { b.disabled = false; say(T()[r && r.error] || T().err); load(); }
      return;
    }
    if (b.dataset.bl) { const u = 'https://t.me/PassTheBatonBot/play?startapp=src_dsmm'; try { tw.openTelegramLink(u); } catch (x) { location.href = u; } return; }
    const save = async (m) => {
      const cur = LOC[m.id] || { h: m.pick ? m.pick.h : 1, a: m.pick ? m.pick.a : 1 };
      const r = await call('pick', { id: m.id, h: cur.h, a: cur.a });
      if (r && r.ok) { D = r; delete LOC[m.id]; hap('success'); draw(); return true; }
      say(T()[r && r.error] || T().err); load(); return false;
    };
    if (b.dataset.mm) {
      const id = b.dataset.mm, m = D.matches.find((x) => x.id === id); if (!m) return;
      const cur = LOC[id] || { h: m.pick ? m.pick.h : 1, a: m.pick ? m.pick.a : 1 };
      const k = b.dataset.k, side = k[0], d = k[1] === '+' ? 1 : -1;
      cur[side] = Math.max(0, Math.min(20, cur[side] + d)); LOC[id] = cur; draw();
      return;
    }
    if (b.dataset.val) {
      const m = D.matches.find((x) => x.id === b.dataset.val); if (!m || b.disabled) return;
      b.disabled = true; await save(m); return;
    }
    const cm = b.dataset.cm;
    if (cm) {
      if (b.disabled) return; b.disabled = true;
      try {
        if (!window.Adsgram) await new Promise((ok2, ko) => { const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; s.onload = ok2; s.onerror = ko; document.head.appendChild(s); });
        let blk = '51754'; try { blk = DS_REWARD; } catch (x) {}
        await window.Adsgram.init({ blockId: blk }).show();
      } catch (x) { b.disabled = false; say(T().vid); return; }
      const r = await call('claim_main', { day: cm });
      if (r && r.ok) { D = r; hap('success'); draw(); if (r.got) say(T().got(r.got)); } else { say(T()[r && r.error] || T().err); load(); }
      return;
    }
    const tr = b.dataset.tr, cl = b.dataset.cl, id = cl || tr || b.dataset.jk, m = D.matches.find((x) => x.id === id); if (!m) return;
    if (tr) { if (m.tr || b.disabled) return; b.disabled = true; }
    else if (cl) { if (!m.pick || m.pick.cl || b.disabled) return; b.disabled = true; }
    else {
      if (m.pick && m.pick.joker) return;
      if (!m.pick || LOC[m.id]) { if (!(await save(m))) return; }
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
  // 27 oct 2026 (20h45, Jeremy): a banner above the menu (every tab) with the player's own $BATON, which opens a sheet that explains
  // everything (his gains by source, how to win, real money on Pass The Baton); in the game, a small line with the total of all players.
  const SH = {
    en: { nav: (n) => '🏃 My gains: ' + n + ' $BATON', nav0: '🏃 Win $BATON: real money', more: 'How it works ›', ttl: 'My $BATON on Daily Score', rows: { m: '⚽ Predictions', w: '🏆 Weekly contest', f: '👥 Invited friends', t: '🎯 Tasks' }, how: 'How to win', lines: ['⚽ Match of the day: +4,000 exact score · +1,000 right result · +200 missed', '🎬 Video bonus: x1.5, x2, x2.5… up to x4 (up to +8,000)', '🏆 Weekly contest: 100,000 / 50,000 / 25,000 on the podium, 10,000 from 4th to 10th, 1,000 for every ranked player', '👥 Every invited friend who plays: +10,000', '🎁 After each match, collect your $BATON with a video'], money: '💵 $BATON are real money: they go to Pass The Baton, our other game, where you swap them for USDT.', btn: '🏃 Open Pass The Baton', close: 'Close', all: (n) => '🌍 ' + n + ' $BATON already won by the players' },
    fr: { nav: (n) => '🏃 Mes gains : ' + n + ' $BATON', nav0: '🏃 Gagne des $BATON : de l\'argent réel', more: 'Comment ça marche ›', ttl: 'Mes $BATON sur Daily Score', rows: { m: '⚽ Pronostics', w: '🏆 Concours de la semaine', f: '👥 Amis invités', t: '🎯 Tâches' }, how: 'Comment en gagner', lines: ['⚽ Match du jour : +4 000 score exact · +1 000 bon résultat · +200 raté', '🎬 Bonus vidéo : x1,5, x2, x2,5… jusqu\'à x4 (jusqu\'à +8 000)', '🏆 Concours de la semaine : 100 000 / 50 000 / 25 000 sur le podium, 10 000 du 4e au 10e, 1 000 pour tous les classés', '👥 Chaque ami invité qui joue : +10 000', '🎁 Après chaque match, récupère tes $BATON avec une vidéo'], money: '💵 Les $BATON sont de l\'argent réel : ils arrivent sur Pass The Baton, notre autre jeu, où tu les échanges contre des USDT.', btn: '🏃 Ouvrir Pass The Baton', close: 'Fermer', all: (n) => '🌍 ' + n + ' $BATON déjà gagnés par les joueurs' },
    es: { nav: (n) => '🏃 Mis ganancias: ' + n + ' $BATON', nav0: '🏃 Gana $BATON: dinero real', more: 'Cómo funciona ›', ttl: 'Mis $BATON en Daily Score', rows: { m: '⚽ Pronósticos', w: '🏆 Concurso semanal', f: '👥 Amigos invitados', t: '🎯 Tareas' }, how: 'Cómo ganar', lines: ['⚽ Partido del día: +4.000 resultado exacto · +1.000 acierto · +200 fallo', '🎬 Bonus vídeo: x1,5, x2, x2,5… hasta x4 (hasta +8.000)', '🏆 Concurso semanal: 100.000 / 50.000 / 25.000 en el podio, 10.000 del 4.º al 10.º, 1.000 para todos los clasificados', '👥 Cada amigo invitado que juega: +10.000', '🎁 Tras cada partido, cobra tus $BATON con un vídeo'], money: '💵 Los $BATON son dinero real: van a Pass The Baton, nuestro otro juego, donde los cambias por USDT.', btn: '🏃 Abrir Pass The Baton', close: 'Cerrar', all: (n) => '🌍 ' + n + ' $BATON ya ganados por los jugadores' },
    pt: { nav: (n) => '🏃 Meus ganhos: ' + n + ' $BATON', nav0: '🏃 Ganhe $BATON: dinheiro real', more: 'Como funciona ›', ttl: 'Meus $BATON no Daily Score', rows: { m: '⚽ Palpites', w: '🏆 Concurso semanal', f: '👥 Amigos convidados', t: '🎯 Tarefas' }, how: 'Como ganhar', lines: ['⚽ Jogo do dia: +4.000 placar exato · +1.000 resultado certo · +200 errado', '🎬 Bônus vídeo: x1,5, x2, x2,5… até x4 (até +8.000)', '🏆 Concurso semanal: 100.000 / 50.000 / 25.000 no pódio, 10.000 do 4º ao 10º, 1.000 para todos os classificados', '👥 Cada amigo convidado que joga: +10.000', '🎁 Após cada jogo, resgate seus $BATON com um vídeo'], money: '💵 Os $BATON são dinheiro real: vão para o Pass The Baton, nosso outro jogo, onde você troca por USDT.', btn: '🏃 Abrir Pass The Baton', close: 'Fechar', all: (n) => '🌍 ' + n + ' $BATON já ganhos pelos jogadores' },
    de: { nav: (n) => '🏃 Meine Gewinne: ' + n + ' $BATON', nav0: '🏃 Gewinne $BATON: echtes Geld', more: 'So funktioniert es ›', ttl: 'Meine $BATON auf Daily Score', rows: { m: '⚽ Tipps', w: '🏆 Wochenwettbewerb', f: '👥 Eingeladene Freunde', t: '🎯 Aufgaben' }, how: 'So gewinnst du', lines: ['⚽ Spiel des Tages: +4.000 exaktes Ergebnis · +1.000 Tendenz · +200 daneben', '🎬 Video-Bonus: x1,5, x2, x2,5… bis x4 (bis +8.000)', '🏆 Wochenwettbewerb: 100.000 / 50.000 / 25.000 auf dem Podium, 10.000 für Platz 4 bis 10, 1.000 für alle in der Wertung', '👥 Jeder eingeladene Freund, der spielt: +10.000', '🎁 Nach jedem Spiel holst du deine $BATON mit einem Video ab'], money: '💵 $BATON sind echtes Geld: Sie landen in Pass The Baton, unserem anderen Spiel, wo du sie gegen USDT tauschst.', btn: '🏃 Pass The Baton öffnen', close: 'Schließen', all: (n) => '🌍 ' + n + ' $BATON schon von den Spielern gewonnen' },
    it: { nav: (n) => '🏃 I miei guadagni: ' + n + ' $BATON', nav0: '🏃 Vinci $BATON: soldi veri', more: 'Come funziona ›', ttl: 'I miei $BATON su Daily Score', rows: { m: '⚽ Pronostici', w: '🏆 Concorso settimanale', f: '👥 Amici invitati', t: '🎯 Compiti' }, how: 'Come vincerli', lines: ['⚽ Partita del giorno: +4.000 risultato esatto · +1.000 esito giusto · +200 sbagliato', '🎬 Bonus video: x1,5, x2, x2,5… fino a x4 (fino a +8.000)', '🏆 Concorso settimanale: 100.000 / 50.000 / 25.000 sul podio, 10.000 dal 4° al 10°, 1.000 a tutti i classificati', '👥 Ogni amico invitato che gioca: +10.000', '🎁 Dopo ogni partita, riscuoti i tuoi $BATON con un video'], money: '💵 I $BATON sono soldi veri: vanno su Pass The Baton, il nostro altro gioco, dove li cambi in USDT.', btn: '🏃 Apri Pass The Baton', close: 'Chiudi', all: (n) => '🌍 ' + n + ' $BATON già vinti dai giocatori' },
    ar: { nav: (n) => '🏃 أرباحي: ' + n + ' $BATON', nav0: '🏃 اربح $BATON: مال حقيقي', more: 'كيف تعمل ›', ttl: '$BATON الخاصة بي في Daily Score', rows: { m: '⚽ التوقعات', w: '🏆 مسابقة الأسبوع', f: '👥 الأصدقاء المدعوون', t: '🎯 المهام' }, how: 'كيف تربح', lines: ['⚽ مباراة اليوم: \u200e+4,000 للنتيجة الدقيقة · \u200e+1,000 للنتيجة الصحيحة · \u200e+200 للخطأ', '🎬 مكافأة الفيديو: ×1.5، ×2، ×2.5… حتى ×4 (حتى \u200e+8,000)', '🏆 مسابقة الأسبوع: 100,000 / 50,000 / 25,000 للمراكز الثلاثة، 10,000 من الرابع إلى العاشر، 1,000 لكل المصنّفين', '👥 كل صديق مدعو يلعب: ‎+10,000', '🎁 بعد كل مباراة، استلم $BATON بفيديو'], money: '💵 $BATON مال حقيقي: تذهب إلى Pass The Baton، لعبتنا الأخرى، حيث تستبدلها بـ USDT.', btn: '🏃 افتح Pass The Baton', close: 'إغلاق', all: (n) => '🌍 ' + n + ' $BATON ربحها اللاعبون' },
    tr: { nav: (n) => '🏃 Kazançlarım: ' + n + ' $BATON', nav0: '🏃 $BATON kazan: gerçek para', more: 'Nasıl çalışır ›', ttl: 'Daily Score\'daki $BATON\'larım', rows: { m: '⚽ Tahminler', w: '🏆 Haftalık yarışma', f: '👥 Davet edilen arkadaşlar', t: '🎯 Görevler' }, how: 'Nasıl kazanılır', lines: ['⚽ Günün maçı: tam skor +4.000 · doğru sonuç +1.000 · yanlış +200', '🎬 Video bonusu: x1,5, x2, x2,5… x4\'e kadar (+8.000\'e kadar)', '🏆 Haftalık yarışma: podyumda 100.000 / 50.000 / 25.000, 4. ile 10. arası 10.000, tüm sıralananlara 1.000', '👥 Oynayan her davetli arkadaş: +10.000', '🎁 Her maçtan sonra $BATON\'larını video ile al'], money: '💵 $BATON gerçek paradır: diğer oyunumuz Pass The Baton\'a gider, orada USDT ile değiştirirsin.', btn: '🏃 Pass The Baton\'ı aç', close: 'Kapat', all: (n) => '🌍 Oyuncular şimdiden ' + n + ' $BATON kazandı' },
    ru: { nav: (n) => '🏃 Мои выигрыши: ' + n + ' $BATON', nav0: '🏃 Выигрывай $BATON: реальные деньги', more: 'Как это работает ›', ttl: 'Мои $BATON в Daily Score', rows: { m: '⚽ Прогнозы', w: '🏆 Конкурс недели', f: '👥 Приглашённые друзья', t: '🎯 Задания' }, how: 'Как выиграть', lines: ['⚽ Матч дня: +4 000 точный счёт · +1 000 исход · +200 мимо', '🎬 Бонус за видео: x1,5, x2, x2,5… до x4 (до +8 000)', '🏆 Конкурс недели: 100 000 / 50 000 / 25 000 на пьедестале, 10 000 с 4-го по 10-е, 1 000 всем в рейтинге', '👥 Каждый приглашённый друг, который играет: +10 000', '🎁 После каждого матча забирай свои $BATON за видео'], money: '💵 $BATON — это реальные деньги: они попадают в Pass The Baton, нашу другую игру, где их можно обменять на USDT.', btn: '🏃 Открыть Pass The Baton', close: 'Закрыть', all: (n) => '🌍 Игроки уже выиграли ' + n + ' $BATON' },
  };
  const S2 = () => SH[lg()] || SH.en;
  const nf2 = (n) => Number(n || 0).toLocaleString(lg());
  const goBaton = () => { const u = 'https://t.me/PassTheBatonBot/play?startapp=src_dsnav'; try { tw.openTelegramLink(u); } catch (x) { location.href = u; } };
  // 28 oct 2026 (16h49, Jeremy): the banner is back with the new rules, and the sponsored Task (Adsgram task-51752) sits inside the sheet:
  // +1 000 $BATON on Pass The Baton (server ds_task_baton), 5 minutes between two Tasks (countdown here, the server refuses earlier ones)
  const NL = {
    en: ['⚽ Match of the day: +5,000 exact score · +1,000 right result · +500 for playing', '🏆 Weekly contest: 10,000 / 5,000 / 2,500 on the podium, 1,000 from 4th to 10th', '🎯 Sponsored task: +1,000, every 5 minutes', '🎁 Added automatically on Pass The Baton'],
    fr: ['⚽ Match du jour : +5 000 score exact · +1 000 bon résultat · +500 pronostic fait', '🏆 Concours de la semaine : 10 000 / 5 000 / 2 500 sur le podium, 1 000 du 4e au 10e', '🎯 Tâche sponsorisée : +1 000, toutes les 5 minutes', '🎁 Ajoutés automatiquement sur Pass The Baton'],
    es: ['⚽ Partido del día: +5.000 resultado exacto · +1.000 buen resultado · +500 por jugar', '🏆 Concurso semanal: 10.000 / 5.000 / 2.500 en el podio, 1.000 del 4.º al 10.º', '🎯 Tarea patrocinada: +1.000, cada 5 minutos', '🎁 Añadidos automáticamente en Pass The Baton'],
    pt: ['⚽ Jogo do dia: +5.000 placar exato · +1.000 resultado certo · +500 por jogar', '🏆 Concurso semanal: 10.000 / 5.000 / 2.500 no pódio, 1.000 do 4º ao 10º', '🎯 Tarefa patrocinada: +1.000, a cada 5 minutos', '🎁 Adicionados automaticamente no Pass The Baton'],
    de: ['⚽ Spiel des Tages: +5.000 exaktes Ergebnis · +1.000 richtige Tendenz · +500 fürs Mitspielen', '🏆 Wochenwettbewerb: 10.000 / 5.000 / 2.500 auf dem Podium, 1.000 von Platz 4 bis 10', '🎯 Gesponserte Aufgabe: +1.000, alle 5 Minuten', '🎁 Automatisch in Pass The Baton gutgeschrieben'],
    it: ['⚽ Partita del giorno: +5.000 risultato esatto · +1.000 esito giusto · +500 per aver giocato', '🏆 Concorso settimanale: 10.000 / 5.000 / 2.500 sul podio, 1.000 dal 4º al 10º', '🎯 Compito sponsorizzato: +1.000, ogni 5 minuti', '🎁 Aggiunti automaticamente su Pass The Baton'],
    ar: ['⚽ مباراة اليوم: +5000 للنتيجة الدقيقة · +1000 للنتيجة الصحيحة · +500 للمشاركة', '🏆 مسابقة الأسبوع: 10000 / 5000 / 2500 للمراكز الثلاثة الأولى، 1000 من الرابع إلى العاشر', '🎯 مهمة مموّلة: +1000 كل 5 دقائق', '🎁 تُضاف تلقائياً في Pass The Baton'],
    tr: ['⚽ Günün maçı: +5.000 tam skor · +1.000 doğru sonuç · +500 tahmin yapınca', '🏆 Haftalık yarışma: podyumda 10.000 / 5.000 / 2.500, 4. ile 10. arası 1.000', '🎯 Sponsorlu görev: +1.000, her 5 dakikada', '🎁 Pass The Baton\'a otomatik eklenir'],
    ru: ['⚽ Матч дня: +5 000 точный счёт · +1 000 исход · +500 за прогноз', '🏆 Конкурс недели: 10 000 / 5 000 / 2 500 на пьедестале, 1 000 с 4-го по 10-е', '🎯 Спонсорское задание: +1 000, каждые 5 минут', '🎁 Начисляются автоматически в Pass The Baton'] };
  const IVL = { en: '👥 Invited friend: +3,000 as soon as he makes his first prediction', fr: '👥 Ami invité : +3 000 dès son premier prono', es: '👥 Amigo invitado: +3.000 en cuanto haga su primer pronóstico', pt: '👥 Amigo convidado: +3.000 assim que fizer o primeiro palpite', de: '👥 Eingeladener Freund: +3.000, sobald er seinen ersten Tipp abgibt', it: '👥 Amico invitato: +3.000 appena fa il primo pronostico', ar: '👥 صديق مدعو: +3000 عند أول توقع له', tr: '👥 Davet edilen arkadaş: ilk tahmininde +3.000', ru: '👥 Приглашённый друг: +3 000 после его первого прогноза' };
  const TK = {
    en: ['🎯 Sponsored task: +1,000 $BATON', 'Next task in', 'No task available, come back later'],
    fr: ['🎯 Tâche sponsorisée : +1 000 $BATON', 'Prochaine tâche dans', 'Pas de tâche disponible, reviens plus tard'],
    es: ['🎯 Tarea patrocinada: +1.000 $BATON', 'Próxima tarea en', 'No hay tareas disponibles, vuelve más tarde'],
    pt: ['🎯 Tarefa patrocinada: +1.000 $BATON', 'Próxima tarefa em', 'Nenhuma tarefa disponível, volte mais tarde'],
    de: ['🎯 Gesponserte Aufgabe: +1.000 $BATON', 'Nächste Aufgabe in', 'Gerade keine Aufgabe, komm später wieder'],
    it: ['🎯 Compito sponsorizzato: +1.000 $BATON', 'Prossimo compito tra', 'Nessun compito disponibile, torna più tardi'],
    ar: ['🎯 مهمة مموّلة: +1000 $BATON', 'المهمة التالية بعد', 'لا توجد مهام الآن، عد لاحقاً'],
    tr: ['🎯 Sponsorlu görev: +1.000 $BATON', 'Sonraki görev', 'Şu an görev yok, sonra tekrar gel'],
    ru: ['🎯 Спонсорское задание: +1 000 $BATON', 'Следующее задание через', 'Сейчас нет заданий, загляни позже'] };
  let tkNode = null, tkI = 0, tkNone = 0;
  const tkAt = () => { try { return Number(localStorage.getItem('dsTaskAt') || 0); } catch (x) { return 0; } };
  const tkNext = () => Math.max(Number((D && D.taskNext) || 0), tkAt() + 300000);
  function mountTask() {
    const box = document.getElementById('mmTask'); if (!box) return;
    clearInterval(tkI);
    const x = TK[lg()] || TK.en, card = (h) => '<div style="padding:12px;border-radius:14px;background:rgba(47,141,255,.14);border:1px solid rgba(80,160,255,.5)"><div style="font-weight:800;font-size:14px;margin-bottom:6px">' + ec(x[0]) + '</div>' + h + '</div>';
    const draw = () => {
      if (!box.isConnected) { clearInterval(tkI); return; }
      const w = Math.ceil((tkNext() - Date.now()) / 1000);
      if (w > 0) { if (tkNode && tkNode.isConnected) tkNode.remove(); box.innerHTML = card('<div style="font-size:14px;font-weight:700">⏳ ' + ec(x[1]) + ' <b style="font-variant-numeric:tabular-nums">' + Math.floor(w / 60) + ':' + String(w % 60).padStart(2, '0') + '</b></div>'); return; }
      clearInterval(tkI);
      if (Date.now() - tkNone < 120000) { box.innerHTML = card('<div style="font-size:14px;opacity:.85">' + ec(x[2]) + '</div>'); return; }
      box.innerHTML = card('<div id="mmTaskIn"></div>');
      const put = () => {
        const inn = document.getElementById('mmTaskIn'); if (!inn) return;
        if (!tkNode) {
          const wr = document.createElement('div');
          wr.innerHTML = '<adsgram-task data-block-id="task-51752" class="dstask"><span slot="reward">+1 000 $BATON</span><div slot="button" class="dstask-btn">▶</div><div slot="claim" class="dstask-btn">🎁</div><div slot="done" class="dstask-btn">✓</div></adsgram-task>';
          tkNode = wr.firstChild; let last = 0;
          const onR = () => {
            if (Date.now() - last < 3000) return; last = Date.now();
            try { localStorage.setItem('dsTaskAt', String(Date.now())); } catch (e) {}
            try { api('ev', { k: 'ad_task_reward' }).catch(() => {}); } catch (e) {}
            try { celebrate('🏃', '+1 000 $BATON', 'Pass The Baton 🏃'); } catch (e) {}
            [4000, 15000].forEach((ms) => setTimeout(() => load(), ms));
            tkNode = null; mountTask();
          };
          const none = (k) => { try { api('ev', { k: 'ad_task_' + k }).catch(() => {}); } catch (e) {} tkNone = Date.now(); if (tkNode) tkNode.remove(); tkNode = null; mountTask(); };
          tkNode.addEventListener('reward', onR); tkNode.addEventListener('onReward', onR);
          tkNode.addEventListener('onBannerNotFound', () => none('none')); tkNode.addEventListener('onError', () => none('err')); tkNode.addEventListener('onTooLongSession', () => none('long'));
          try { api('ev', { k: 'ad_task' }).catch(() => {}); } catch (e) {}
        }
        inn.appendChild(tkNode);
      };
      if (typeof loadTads === 'function') loadTads(put, () => { tkNone = Date.now(); mountTask(); }); else put();
    };
    draw(); if (tkNext() > Date.now()) tkI = setInterval(draw, 1000);
  }
  function openSheet() {
    hap(); const s = S2(), bk = (D && D.dsbk) || {}, tot = Number((D && D.dsbt) || 0);
    let o = document.getElementById('mmSheet'); if (o) o.remove();
    o = document.createElement('div'); o.id = 'mmSheet';
    o.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center';
    const rows = ['m', 'w', 'f', 't'].filter((k) => Number(bk[k]) > 0).map((k) => '<div style="display:flex;justify-content:space-between;gap:8px;padding:7px 0;border-top:1px solid var(--line,rgba(255,255,255,.09))"><span>' + ec(s.rows[k]) + '</span><b>' + nf2(bk[k]) + '</b></div>').join('');
    o.innerHTML = '<div style="width:100%;max-width:480px;max-height:88vh;overflow:auto;background:var(--card,#13241a);border:1px solid var(--line,rgba(255,255,255,.09));border-radius:20px 20px 0 0;padding:18px 16px calc(18px + env(safe-area-inset-bottom,0px));color:var(--ink,#f2f7f3)">'
      + '<div class="label" style="margin-bottom:6px">🏃 ' + ec(s.ttl) + '</div>'
      + '<div style="font-family:\'Barlow Condensed\',sans-serif;font-weight:800;font-size:40px;color:var(--lime,#c6ff3d);line-height:1.1">' + nf2(tot) + ' $BATON</div>'
      + (rows ? '<div style="margin:10px 0 4px;font-size:14px">' + rows + '</div>' : '')
      + '<div style="margin-top:12px;padding:12px;border-radius:14px;background:rgba(255,200,61,.10);border:1px solid rgba(255,200,61,.35);font-size:14px;line-height:1.45">' + ec(s.money) + '</div>'
      + '<div class="label" style="margin:16px 0 6px">' + ec(s.how) + '</div>'
      + '<div id="mmTask" style="margin-top:12px"></div>'
      + (NL[lg()] || NL.en).concat([IVL[lg()] || IVL.en]).map((l) => '<div style="font-size:14px;line-height:1.4;padding:6px 0;border-top:1px solid var(--line,rgba(255,255,255,.09))">' + ec(l) + '</div>').join('')
      + (D && D.dsall > 0 ? '<div class="note" style="margin-top:10px;color:var(--lime,#c6ff3d)">' + ec(s.all(nf2(D.dsall))) + '</div>' : '')
      + '<button class="btn gold" id="mmShGo" style="margin-top:14px">' + ec(s.btn) + '</button>'
      + '<button class="btn ghost" id="mmShX" style="margin-top:8px">' + ec(s.close) + '</button></div>';
    document.body.appendChild(o);
    o.onclick = (e) => { if (e.target === o) o.remove(); };
    document.getElementById('mmShX').onclick = () => o.remove();
    document.getElementById('mmShGo').onclick = () => { hap(); goBaton(); };
    mountTask();
  }
  window.dsOpenBatonSheet = openSheet;
  // the banner above the menu, put back after every redraw of the menu
  function navBan() {
    const nav = document.getElementById('nav'); if (!nav || !D) return;
    if (D.ban_on === false) { const ob = document.getElementById('mmNavBan'); if (ob) { ob.remove(); try { fitNav(); } catch (x) {} } return; }  // 28 oct 2026: no more $BATON on Daily Score
    const inn = nav.querySelector('.nav-in'); if (!inn) return;
    const s = S2(), tot = Number(D.dsbt || 0), k = tot + lg();
    let b = document.getElementById('mmNavBan');
    if (!b || !b.isConnected) {
      b = document.createElement('div'); b.id = 'mmNavBan'; b.className = 'igban';
      b.style.cssText = 'cursor:pointer;background:linear-gradient(135deg,rgba(47,141,255,.30),rgba(30,90,200,.14));border-color:rgba(80,160,255,.6)';
      b.onclick = openSheet;
      inn.insertAdjacentElement('beforebegin', b);
      try { fitNav(); } catch (x) {}
    }
    if (b.dataset.k !== k) { b.dataset.k = k; b.innerHTML = '<div style="min-width:0"><b>' + ec(tot > 0 ? s.nav(nf2(tot)) : s.nav0) + '</b></div><span class="iggo">' + ec(s.more) + '</span>'; try { fitNav(); } catch (x) {} }
  }
  setInterval(navBan, 700);
  window.mmReload = () => load();  // 27 oct 2026: called after a Task, so the gains banner shows the new $BATON
})();
