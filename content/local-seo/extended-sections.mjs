/** Extended medical sections to reach 1200–2000 words per Local SEO page */

const L = {
  addr: 'Kaiser-Ebersdorfer-Straße 328, 1110 Wien (Simmering)',
  district: 'Wien 11 (Simmering)',
  phone: '01 / 769 29 91',
};

/** @type {Record<string, import('./pages.mjs').Section[]>} */
export const EXTENDED_SECTIONS = {
  'r-force-therapie-wien': [
    {
      h2: 'Häufige Fragen aus der Praxis in Wien 11',
      paragraphs: [
        `Viele Patientinnen und Patienten fragen, ob sie mit Krücken in die R-Force-Kammer steigen können – in der Regel ja, mit therapeutischer Begleitung und angepasster Entlastung. Sicherheitsschulung ist Teil der ersten Einheit.`,
        `Ein weiteres Thema ist Scham oder Unsicherheit nach langer Immobilität: Das geschlossene System der Kammer wirkt für manche beruhigend, weil Sturzangst reduziert wird. Wir gehen respektvoll und ohne Zeitdruck vor.`,
        `Die Kombination aus R-Force und klassischer Heilgymnastik ist in der Regel sinnvoller als ausschließlich Laufband – Muskulatur um Hüfte, Knie und Rumpf muss parallel adressiert werden, sonst bleibt der Gang instabil.`,
        `Wir dokumentieren Belastungsstufen und Gangparameter und besprechen sie mit Ihnen – Transparenz schafft Motivation und erleichtert Abstimmung mit Orthopädie oder Hausärztin, falls Überweisungen oder Verlaufsberichte nötig sind.`,
      ],
    },
    {
      h2: 'Patientengruppen, die besonders profitieren',
      paragraphs: [
        `Sportlerinnen und Sportler nach distorsiven Knie- oder Sprunggelenksverletzungen nutzen R-Force, um die Belastung dosiert zu steigern, bevor sie wieder voll auf hartem Untergrund laufen. Die kontrollierte Entlastung reduziert Angst vor Nachbelastung – ein psychologischer Faktor, der Reha-Verläufe oft verzögert.`,
        `Ältere Patientinnen und Patienten mit Gleichgewichtsproblemen trainieren sicherer, weil Sturzrisiko und Gelenkstress sinken. Die visuelle Rückmeldung zum Gangbild unterstützt die Korrektur asymmetrischer Muster, die nach Hüft- oder Knieoperationen häufig sind.`,
        `Neurologische Patientinnen und Patienten – etwa nach Schlaganfall – profitieren von repetitivem, task-spezifischem Gehtraining in einer geschützten Umgebung. R-Force ersetzt keine neurorehabilitative Fachbetreuung, ist aber ein wertvolles Gerät im multimodalen Konzept.`,
      ],
      subsections: [
        {
          h3: 'Integration in Ihren Alltag in Wien',
          paragraphs: [
            `Viele unserer Patientinnen und Patienten pendeln aus Simmering, dem 10. oder 23. Bezirk zu uns. Kurze Wege erleichtern 2–3 Termine pro Woche in der Aufbauphase. Wir planen Termine pragmatisch – auch im Hinblick auf Öffi-Anbindung (Bus 71B, 73A, Tram 11).`,
            `Hausübungen ergänzen jede R-Force-Einheit: leichte Kräftigung, Dehnung und Haltungsübungen für Zuhause verlängern den Effekt zwischen den Präsenzterminen in der Ordination.`,
          ],
        },
      ],
    },
    {
      h2: 'Qualität und ärztliche Verantwortung',
      paragraphs: [
        `Dr. med. univ. Fadime Cenik ist Fachärztin für Physikalische Medizin und allgemeine Rehabilitation mit langjähriger Erfahrung am Standort seit 1990. R-Force wird nicht als isoliertes Wellness-Gadget angeboten, sondern als medizinische Maßnahme mit Indikation, Verlaufskontrolle und Dokumentation.`,
        `Vor Beginn klären wir Kontraindikationen, Medikation und Begleiterkrankungen. Bei Bedarf stimmen wir uns mit Orthopädie oder Neurologie ab – Ihre Sicherheit steht im Mittelpunkt.`,
        `Die Ordination akzeptiert Kassenleistungen der ÖGK, BVAEB und SVS (bei Verordnung) sowie Privatpatientinnen und Privatpatienten. Transparente Kommunikation zu Kosten und erwartbarer Therapiedauer ist uns wichtig – rufen Sie uns unter ${L.phone} an.`,
      ],
    },
    {
      h2: 'Erwartungen realistisch setzen',
      paragraphs: [
        `R-Force beschleunigt nicht jede Genesung, aber es ermöglicht früheres, sichereres Training in Phasen, in denen volle Belastung noch nicht möglich ist. Fortschritte sind individuell – abhängig von Alter, Ausgangsdiagnose, Compliance und Begleittherapien.`,
        `Wir messen Erfolg an funktionellen Zielen: weniger Schmerz beim Gehen, längere Gehstrecken, stabilere Treppe, Rückkehr zum Sport oder zur Arbeit. Digitale Trainingsdaten helfen, diese Ziele objektiv zu verfolgen.`,
        `Technische Details zum Gerät, Biofeedback und Anwendungsbeispiele finden Sie auf der <a href="../r-force.html">R-Force Produktseite</a>. Für eine persönliche Indikationsstellung vereinbaren Sie einen Termin über <a href="../termin.html">termin.html</a> oder telefonisch.`,
      ],
    },
    {
      h2: 'R-Force in Wien 11 – Ihr nächster Schritt',
      paragraphs: [
        `Ob nach Sportverletzung, Gelenksoperation oder neurologischem Ereignis: Der erste Schritt ist eine fachärztliche Einschätzung. Wir prüfen, ob R-Force in Ihrem Fall sinnvoll ist und wie es in Ihr Gesamtprogramm passt – inklusive Heilgymnastik, Massage und ggf. Stoßwelle bei Sehnenproblemen.`,
        `Viele Patientinnen und Patienten aus Simmering, dem 10. und 23. Bezirk schätzen, dass sie nicht quer durch Wien fahren müssen, um modernes Gehtraining zu erhalten. Das reduziert Ausfallzeiten im Beruf und erleichtert die Einhaltung von zwei bis drei Terminen pro Woche in der Aufbauphase.`,
        `Bringen Sie zur Erstanamnese Verordnungen, Operationsberichte und vorhandene Bildgebung mit. Je klarer die Ausgangslage, desto zielgerichteter können wir Belastungsstufen und Trainingsziele definieren – von erstem schmerzarmen Gehen bis zur Rückkehr in Sport und Beruf.`,
        `Unsere Ordination verbindet seit 1990 persönliche Betreuung mit moderner Technik. Dr. Fadime Cenik ist Fachärztin für Physikalische Medizin – Sie sind in ärztlicher Verantwortung, nicht in einem anonymen Fitnessstudio mit Laufband.`,
        `Kontakt: ${L.phone}, ${L.addr}. Online-Terminanfrage über <a href="../termin.html">termin.html</a>. Kassen ÖGK, BVAEB, SVS mit Verordnung; Privatordination auf Anfrage.`,
      ],
    },
  ],

  'stosswellentherapie-wien': [
    {
      h2: 'Indikationsbeispiele aus der Alltagspraxis',
      paragraphs: [
        `Tennisarm nach repetitiver Mausarbeit, Golferellenbogen beim Handwerk, Achillessehnenreizung beim Joggen in Wien, Fersenschmerz nach langen Spaziergängen, calcifying Schulter – die Palette ist breit, die Indikationsstellung bleibt individuell.`,
        `Wir fragen gezielt nach Dauer, bisherigen Spritzen, Physiotherapie-Serien und Arbeitshaltung. Wer bereits drei Monate ohne Besserung massiert wurde, braucht oft eine Strategieänderung – nicht „noch mehr vom Gleichen“.`,
        `ESWT ist kein Ersatz für operative Sanierung bei vollständiger Sehnenruptur oder instabilen Frakturen. Wir empfehlen Weiterleitung, wenn konservative Mittel ausgeschöpft sind und die Funktion weiter abnimmt.`,
        `In Simmering schätzen Patientinnen und Patienten die direkte Erreichbarkeit für die mehrwöchige Serie – ein praktischer Vorteil gegenüber weit entfernten Zentren ohne persönliche ärztliche Betreuung.`,
      ],
    },
    {
      h2: 'Wissenschaftliche Einordnung der ESWT',
      paragraphs: [
        `Die extrakorporale Stoßwellentherapie ist für bestimmte orthopädische Indikationen wie Plantarfasziitis, calcifying tendinitis der Schulter oder chronische Epicondylalgie in Leitlinien und Übersichtsarbeiten als sinnvolle Option verankert. Wirkmechanismen umfassen neovaskuläre Prozesse, Modulation entzündlicher Signale und Abbau von Kalzifikationen.`,
        `Entscheidend ist die richtige Patientenselektion: ESWT hilft bei chronischen Verläufen, nicht bei frischen akuten Entzündungen. In unserer Ordination in ${L.district} bewerten wir Dauer, bisherige Therapien und körperliche Untersuchung, bevor wir eine Serie planen.`,
        `Wir kombinieren ESWT nicht mit „mehr ist besser“, sondern mit strukturierter Nachsorge: Dehnung, exzentrisches Training, Einlagenberatung bei Ferse oder Haltungsschulung bei Ellenbogenbelastung im Büroalltag.`,
      ],
    },
    {
      h2: 'Typischer Behandlungsverlauf in Simmering',
      paragraphs: [
        `Ersttermin: Anamnese, klinische Tests, Besprechung von Bildgebung, die Sie mitbringen. Zweiter Termin: erste ESWT-Sitzung nach Aufklärung. Folgetermine im Wochenabstand – meist drei bis fünf Sitzungen.`,
        `Zwischen den Terminen: vereinbarte Eigenübungen, ggf. Tape oder Entlastung. Wir dokumentieren Schmerzverlauf und Funktion – bei fehlendem Ansprechen überdenken wir Diagnose oder empfehlen weiterführende Abklärung.`,
        `Die Ordination ist seit 1990 etabliert – Kontinuität und erreichbare Lage in Simmering erleichtern die Serie, die über mehrere Wochen läuft.`,
      ],
      subsections: [
        {
          h3: 'Nach der Sitzung',
          paragraphs: [
            `Leichte Hautrötung oder Druckempfindlichkeit sind normal und klingen meist innerhalb von 24–48 Stunden ab. Intensive sportliche Belastung pausieren wir kurz. Schmerzmittel besprechen wir individuell – nicht jede Schmerztablette ist in der unmittelbaren Umgebung der ESWT sinnvoll.`,
          ],
        },
      ],
    },
    {
      h2: 'ESWT und andere Schmerzthemen – ohne Keyword-Doppelung',
      paragraphs: [
        `Diese Seite fokussiert Stoßwellentherapie als Verfahren – nicht die generelle Rücken- oder Nackenversorgung. Bei zervikalen Beschwerden ohne Sehnenbezug lesen Sie <a href="nackenschmerzen-ursachen/">Nackenschmerzen Ursachen</a>; bei lumbalen Schmerzen <a href="rueckenschmerzen-wien/">Rückenschmerzen Wien</a>.`,
        `Bei myofaszialen Triggerpunkten steht Manuelle Therapie im Vordergrund – siehe <a href="faszienschmerzen/">Faszienschmerzen</a>. Bei Knie- oder Schulterproblemen verlinken unsere thematischen Seiten auf ESWT, wenn es passt.`,
        `Das Gesamtangebot der Praxis finden Sie im <a href="../therapieangebot.html">Therapieangebot</a>. Termin: ${L.phone}.`,
      ],
    },
    {
      h2: 'Stoßwelle in Wien 11 buchen – Ablauf kurz',
      paragraphs: [
        `Telefonisch unter ${L.phone} oder online über <a href="../termin.html">termin.html</a> vereinbaren Sie einen Ersttermin. Wir klären Indikation, bisherige Therapien und Kassenstatus (ÖGK, BVAEB, SVS).`,
        `Die Behandlung selbst ist kurz; der größte Effekt entsteht durch die Serie über Wochen plus Eigenübungen. Planen Sie realistisch drei bis fünf Termine – nicht eine einzelne „Wunder-Sitzung“.`,
        `Bei Schulter- oder Kniesehnenproblemen verlinken unsere Seiten <a href="schulter-schmerzen/">Schulterschmerzen</a> und <a href="knieschmerzen-behandlung/">Knieschmerzen</a> – ESWT ist dort als Option eingebettet, diese Seite bleibt das ESWT-Schwerpunktthema.`,
        `Standort: ${L.addr}, ${L.district}. Seit 1990 etabliert – Vertrauen, Kontinuität, ärztliche Verantwortung durch Dr. Fadime Cenik, Fachärztin für Physikalische Medizin und allgemeine Rehabilitation.`,
      ],
    },
  ],

  'nackenschmerzen-ursachen': [
    {
      h2: 'Mythen und Fakten zu Nackenschmerzen',
      paragraphs: [
        `„Der Nacken muss eingerichtet werden“ – manipulative Eingriffe ohne klare Indikation sind nicht immer nötig und können bei bestimmten Pathologien riskant sein. Wir wählen Techniken evidenz- und sicherheitsgeleitet.`,
        `„Immer MRT machen“ – bei unkomplizierten muskulären Verspannungen ohne neurologische Zeichen ist Bildgebung oft nicht hilfreich und kann zu Überbehandlung führen.`,
        `„Nur Ruhe hilft“ – kurze Schonung ja, längeres Fehlen von Bewegung verschlechtert oft die Prognose. Aktive, dosierte Mobilisation ist meist besser.`,
        `„Pille gegen Verspannung“ – Medikamente können akut entlasten, ersetzen aber nicht Ergonomie, Bewegung und manualtherapeutische Arbeit an der Ursache.`,
      ],
    },
    {
      h2: 'Haltung, Ergonomie und moderne Arbeitswelt',
      paragraphs: [
        `Laptop auf dem Sofa, zwei Monitore unterschiedlicher Höhe, stundenlanges Telefonieren mit geklemmtem Handy – all das erhöht die Belastung der Nackenmuskulatur. In Wien pendeln viele Patientinnen und Patienten zusätzlich mit schweren Taschen oder lesen im stehenden Bus – Mikrobeschleunigungen belasten die HWS.`,
        `Ergonomische Anpassung ist kein Luxus, sondern Therapiebestandteil: Bildschirmhöhe, Stuhl, Armstützen, Pausen alle 45–60 Minuten. Wir geben konkrete Empfehlungen für Homeoffice und Büro – angepasst an Ihre realen Bedingungen, nicht an Idealbilder.`,
        `Psychischer Stress verstärkt den Muskeltonus: Wer unter Zeitdruck arbeitet oder Schlafprobleme hat, berichtet häufiger über „steifen Nacken“. Entspannungsverfahren, Atemübungen und strukturierte Pausen sind legitime medizinische Begleitmaßnahmen.`,
      ],
    },
    {
      h2: 'Degenerative und strukturelle Faktoren der HWS',
      paragraphs: [
        `Mit zunehmendem Alter treten häufiger degenerative Veränderungen der Halswirbelsäule auf – ohne dass jedes MRT-Befund mit Ihren Schmerzen korreliert. Klinische Untersuchung bleibt zentral: Beweglichkeit, Reflexe, Sensibilität, Kraft der Arme.`,
        `Nach whiplash-ähnlichen Mechanismen (z. B. Auffahrunfall) können Gelenk- und Bandstrukturen der HWS irritiert sein – auch wenn der Unfall schon Monate zurückliegt. Dann braucht es strukturierte Mobilisation, nicht nur passive Massage.`,
        `Bei Verdacht auf Nervenwurzelbeteiligung (Ausstrahlung, Taubheit) planen wir die Diagnostik sorgfältig – gegebenenfalls mit Bildgebung oder Überweisung.`,
      ],
      subsections: [
        {
          h3: 'Zusammenspiel mit Schulter und Kiefer',
          paragraphs: [
            `Der Schultergürtel und die HWS bilden eine funktionelle Einheit – Schulterschmerzen können Nackenverspannungen verstärken und umgekehrt. Auch CMD (craniomandibuläre Dysfunktion) kann Nackenmuskulatur mitbelasten. Wir schauen ganzheitlich, ohne Spekulation.`,
          ],
        },
      ],
    },
    {
      h2: 'Therapieweg in unserer Ordination – ohne Rücken-Duplikat',
      paragraphs: [
        `Diese Seite klärt Ursachen und Warnsignale des Nackens – die Behandlung lumbaler Rückenschmerzen beschreiben wir separat unter <a href="rueckenschmerzen-wien/">Rückenschmerzen Wien</a>, um Inhalte nicht zu vermischen.`,
        `Bei muskulär-faszialer Beteiligung können Heilmassage, myofasziale Techniken und Heilgymnastik helfen – siehe auch <a href="faszienschmerzen/">Faszienschmerzen</a>. Elektrotherapie, Wärme und Taping sind weitere Bausteine.`,
        `Dr. Cenik ist Fachärztin in ${L.district}, ${L.addr}. Kassen ÖGK, BVAEB, SVS mit Verordnung. Termin: ${L.phone} oder <a href="../termin.html">Online</a>.`,
      ],
    },
    {
      h2: 'Nächste Schritte bei anhaltenden Nackenbeschwerden',
      paragraphs: [
        `Führen Sie ein kurzes Schmerztagebuch: Wann tritt der Schmerz auf (morgens, abends, bei Arbeit)? Gibt es Ausstrahlung in Arm oder Hand? Diese Information beschleunigt die Erstanamnese.`,
        `Bringen Sie Verordnungen und vorhandene Befunde mit. Bei Warnsignalen suchen Sie bitte nicht erst Massagetermine, sondern zeitnahe ärztliche Abklärung – wir verweisen bei Red Flags sofort weiter.`,
        `Unsere Ordination in Simmering ist für Patientinnen und Patienten aus dem 11. Bezirk und Umgebung gut erreichbar – wichtig, wenn mehrere Therapieeinheiten nötig sind.`,
        `Diese Seite fokussiert Ursachen und Einordnung des Nackens. Für lumbale Therapie siehe <a href="rueckenschmerzen-wien/">Rückenschmerzen Wien</a>; für fasziale Muster <a href="faszienschmerzen/">Faszienschmerzen</a>.`,
      ],
    },
  ],

  'rueckenschmerzen-wien': [
    {
      h2: 'Leitlinienorientierte Behandlung',
      paragraphs: [
        `Internationale Leitlinien betonen bei unspezifischen Rückenschmerzen: Aufklärung, Aktivierung, multimodale Therapie bei Chronifizierungsrisiko. Röntgen und MRT nicht routinemäßig bei Erstkontakt ohne Red Flags.`,
        `Red Flags: Fieber, ungewollter Gewichtsverlust, Trauma, Osteoporose mit Verdacht auf Fraktur, neurologische Ausfälle, Cauda-equina-Zeichen, Krebsanamnese. Diese führen zu sofortiger anderer Versorgung.`,
        `In unserer Ordination strukturieren wir Verordnungseinheiten sinnvoll: Heilgymnastik für Aktivierung, Massage für muskuläre Komponente, physikalische Verfahren bei klarer Indikation – ohne Therapie-Inflation.`,
        `Patientinnen und Patienten aus Wien 11 profitieren von kurzer Anfahrt für wöchentliche Einheiten – ein Faktor, der in Studien oft unterschätzt wird, in der Praxis aber Therapieabbrüche reduziert.`,
      ],
    },
    {
      h2: 'Akut vs. chronisch – unterschiedliche Strategien',
      paragraphs: [
        `Akute Rückenschmerzen (unter sechs Wochen) brauchen oft Beruhigung, angepasste Bewegung und kurzfristige Schmerzreduktion – nicht sofort umfangreiche Diagnostik. Chronische Beschwerden (über zwölf Wochen) erfordern ein multimodales Konzept: Bewegung, manuelle Therapie, Schmerzedukation, ggf. psychologische Unterstützung.`,
        `Subakute Phasen dazwischen sind Übergänge: hier entscheidet sich, ob ein Patient wieder voll in Alltag und Beruf einsteigt oder in Chronifizierung rutscht. Frühe, qualifizierte Physiotherapie in Wien kann diesen Übergang positiv beeinflussen.`,
        `Wir klassifizieren nach Schmerzcharakter, Ausstrahlung, neurologischen Zeichen und Alltagsbeeinträchtigung – nicht nur nach Schmerzskala 0–10.`,
      ],
    },
    {
      h2: 'Belastung im Alltag: Simmering und Pendeln',
      paragraphs: [
        `Langes Sitzen in Bus oder Büro, Heben ohne Hüftbeugung, asymmetrisches Tragen von Einkaufstaschen – typische Alltagsfehler. Viele Patientinnen und Patienten aus dem 11. Bezirk berichten von Beschwerden nach Schichtarbeit oder langer Fahrt zur Arbeit.`,
        `Wir analysieren diese Faktoren und geben praktische Empfehlungen: Mikropausen, Rumpfstabilisation, ergonomische Anpassung. Ziel ist nicht „perfekte Haltung“, sondern belastbare Variation.`,
        `Bewegungstherapie in der Ordination wird durch Hausprogramme ergänzt – realistisch umsetzbar in Wiener Wohnungen, ohne Spezialgeräte.`,
      ],
      subsections: [
        {
          h3: 'Ischialgie und Ausstrahlung',
          paragraphs: [
            `Ausstrahlende Schmerzen ins Bein erfordern sorgfältige neurologische Untersuchung. Bei Verdacht auf radikuläre Beteiligung oder Cauda-equina-Zeichen (Taubheit im Intimbereich, Blasenstörung) ist sofortige Notfallabklärung nötig – unabhängig von unserer konservativen Schwerpunktsetzung.`,
          ],
        },
      ],
    },
    {
      h2: 'Langfristige Begleitung seit 1990 am Standort',
      paragraphs: [
        `Chronische Rückenschmerzen sind kein Einzeltermin-Problem. Vertrauen, Kontinuität und erreichbare Praxis sind wichtig – unsere Ordination in Simmering bietet beides über Jahrzehnte.`,
        `Wir koordinieren physikalische Therapie und verweisen bei Bedarf an andere Fachdisziplinen. Onkologische Rehabilitation und komplexe Reha-Fälle gehören zum Erfahrungsspektrum der Fachärztin.`,
        `Nackenursachen und Rückentherapie trennen wir inhaltlich: <a href="nackenschmerzen-ursachen/">Nackenschmerzen Ursachen</a> vs. diese Seite. Fasziale Komponenten: <a href="faszienschmerzen/">Faszienschmerzen</a>. Termin unter ${L.phone}.`,
      ],
    },
    {
      h2: 'Rückenschmerzen in Wien 11 – Termin und Erwartungen',
      paragraphs: [
        `Vereinbaren Sie unter ${L.phone} oder <a href="../termin.html">termin.html</a> einen Ersttermin. Wir erheben Befund, besprechen Ziele und planen Heilgymnastik, Massage und physikalische Verfahren – ohne Versprechen von „Wunderheilung“.`,
        `Realistische Ziele: weniger Schmerz im Alltag, bessere Beweglichkeit, Rückkehr zur Arbeit oder zu Hobbyaktivitäten in Wien. Messen wir Fortschritt, passen wir Therapie an – nicht starr nach Schema F.`,
        `Bei Gangstörung nach OP kann <a href="r-force-therapie-wien/">R-Force</a> ergänzen. Bei Sehnenansatzproblemen <a href="stosswellentherapie-wien/">Stoßwelle</a>. Bei Triggerpunkten <a href="faszienschmerzen/">Faszienschmerzen</a>.`,
        `Adresse: ${L.addr}. Kassen ÖGK, BVAEB, SVS. Privatordination möglich. Seit 1990 am Standort – Dr. Fadime Cenik, Fachärztin für Physikalische Medizin.`,
      ],
    },
  ],

  'knieschmerzen-behandlung': [
    {
      h2: 'Praktische Tipps zwischen den Terminen',
      paragraphs: [
        `Treppe steigen: zuerst schmerzarmes Bein, dann belastetes – wir zeigen individuelle Strategien je nach Diagnose (z. B. Meniskus vs. Patellofemoral).`,
        `Sitzen: langes Sitzen mit gebeugtem Knie belastet die Patella – Mikrobewegung alle 30–45 Minuten entlastet.`,
        `Schuhe und Untergrund: harte Wiener Gehsteige vs. weicher Parkuntergrund – Belastungssteuerung im Alltag besprechen wir offen.`,
        `Schwellung nach Belastung: Kühlung, Hochlagern, Kompression nach Anleitung – nicht jede Schwellung bedeutet Rückschritt, aber wir evaluieren es.`,
      ],
    },
    {
      h2: 'Gonarthrose – was wirklich hilft',
      paragraphs: [
        `Bei Kniegelenksarthrose sind Muskelaufbau (v. a. Quadrizeps), Gewichtsmanagement, Bewegungstherapie und Schmerzsteuerung die tragenden Säulen – international konsentiert. Injektionen oder Operationen sind nicht immer der erste Schritt.`,
        `Wir messen Kraft, Bewegungsumfang und Gangbild und setzen realistische Ziele: Treppen steigen ohne Pause, Spaziergang im Donaupark, Arbeitsfähigkeit. Jede Zieldefinition ist individuell.`,
        `Bei fortgeschrittener Arthrose bleibt konservative Therapie oft lange wirksam – wir begleiten Sie und empfehlen orthopädische Mitbeurteilung, wenn Funktionsverlust progressiv ist.`,
      ],
    },
    {
      h2: 'Sportverletzungen und Überlastung',
      paragraphs: [
        `Läuferinnen und Läufer, Fußballerinnen und Fußballer, Handwerkerinnen und Handwerker mit Knieschmerzen durch Überlastung brauchen Belastungssteuerung – nicht nur Ruhe. Wir strukturieren Return-to-Sport schrittweise.`,
        `Nach Kreuzband- oder Meniskus-OP ist R-Force ein Alleinstellungsmerkmal unserer Ordination: gewichtsentlastetes Gehtraining unter fachärztlicher Begleitung. Mehr unter <a href="r-force-therapie-wien/">R-Force Therapie Wien</a>.`,
        `Chronische Patellasehnen- oder Pes-anserinus-Beschwerden können von <a href="stosswellentherapie-wien/">Stoßwellentherapie</a> profitieren – nach klinischer Indikation.`,
      ],
      subsections: [
        {
          h3: 'Kindliche und jugendliche Kniebeschwerden',
          paragraphs: [
            `Wachstumsbedingte Reizungen (z. B. Osgood-Schlatter) brauchen andere Dosierung als Arthrose im Alter. Wir passen Therapie und Sportempfehlungen altersgerecht an – und klären Eltern transparent auf.`,
          ],
        },
      ],
    },
    {
      h2: 'Praxisorganisation in Wien 11',
      paragraphs: [
        `Knietherapie erfordert oft Serien über Wochen. Unsere Lage in ${L.addr} ist mit Öffis gut erreichbar – wichtig für Therapietreue.`,
        `Kassen ÖGK, BVAEB, SVS mit Verordnung; Privatordination möglich. Dr. Cenik koordiniert ärztlich – Sie sind nicht allein zwischen verschiedenen Angeboten.`,
        `Begleitende Rücken- oder Hüftprobleme beeinflussen das Knie – deshalb schauen wir ganzheitlich. <a href="rueckenschmerzen-wien/">Rückenschmerzen Wien</a>. Termin: ${L.phone}.`,
      ],
    },
    {
      h2: 'Knieschmerzen – wann Sie uns in Simmering aufsuchen sollten',
      paragraphs: [
        `Bei anhaltenden Beschwerden über zwei bis drei Wochen, Schwellung, Instabilität oder nächtlichem Schmerz ist Abklärung sinnvoll – nicht „abwarten bis es von selbst geht“.`,
        `Nach Operation oder Verletzung: strukturierte Reha verhindert chronische Belastungsunterschiede und erleichtert Rückkehr zum Sport. R-Force kann hier ein entscheidender Baustein sein.`,
        `Wir koordinieren konservative Therapie und empfehlen Orthopädie, wenn Bildgebung oder OP-Optionen nötig werden – transparent und ohne Verzögerung bei Red Flags.`,
        `Termin: ${L.phone}, ${L.addr}. Online: <a href="../termin.html">termin.html</a>. Übersicht: <a href="../therapieangebot.html">Therapieangebot</a>.`,
      ],
    },
  ],

  'schulter-schmerzen': [
    {
      h2: 'Nachtschmerz und Schlaf – häufiges Thema',
      paragraphs: [
        `Schulterschmerzen im Liegen – besonders auf der betroffenen Seite – sind klassisch bei Rotatorenmanschettenreizung und Frozen Shoulder. Schlafposition, Kissenführung und vorsorgliche Abduktionskissen können entlasten.`,
        `Wir raten nicht pauschal von Nachtübungen ab, empfehlen aber keine aggressiven Dehnungen vor dem Schlafengehen bei akuter Entzündung.`,
        `Schmerz verstehen hilft: Nachtschmerz ist ein Therapieziel, nicht nur Tagesbeschwerde. Fortschritt messen wir auch an Schlafqualität.`,
        `Bei anhaltendem Nachtschmerz über Monate ohne Besserung prüfen wir Indikation zur weiteren Abklärung – konservativ bleiben wir, solange es medizinisch vertretbar und funktionell förderlich ist.`,
      ],
    },
    {
      h2: 'Rotatorenmanschette und Impingement verstehen',
      paragraphs: [
        `Die Rotatorenmanschette stabilisiert den Schultergelenkkopf im Glenoid. Reizungen oder partielle Rupturen äußern sich durch Schmerz bei Überkopfarbeit, Nachtschmerz auf der betroffenen Seite und Kraftdefizite. Nicht jede Ruptur braucht sofort OP – viele Patientinnen und Patienten profitieren von strukturierter konservativer Therapie.`,
        `Subacromiales Impingement entsteht durch Einengung zwischen Akromion und Sehnen – oft kombiniert mit Haltungsmustern und Thoraxsteifigkeit. Therapie zielt auf Schulterblattführung, Rotatorenmanschetten-Kraft und Mobilisation.`,
        `Bildgebung (Ultraschall, MRT) kann helfen, ist aber nicht bei jedem ersten Besuch zwingend – klinische Untersuchung führt.`,
      ],
    },
    {
      h2: 'Schulter und Nacken – gemeinsam betrachten',
      paragraphs: [
        `Viele Schulterpatientinnen und -patienten haben gleichzeitig zervikale Verspannungen. Wir unterscheiden primäre Schulterpathologie von überlagerten Nackenproblemen – ohne Inhalte zu duplizieren: Details zu HWS unter <a href="nackenschmerzen-ursachen/">Nackenschmerzen Ursachen</a>.`,
        `Myofasziale Verspannungen im Schultergürtel behandeln wir auch im Kontext von <a href="faszienschmerzen/">Faszienschmerzen</a> – immer nach Befund, nicht nach Vermutung.`,
        `Arbeitsbedingte Belastung (Malerinnen, Pflegekräfte, Musikerinnen) besprechen wir offen – Therapie muss in Ihren Alltag passen.`,
      ],
      subsections: [
        {
          h3: 'Nach Schulteroperation',
          paragraphs: [
            `Nach Schulter-OP (z. B. Sehnennaht) ist phased rehabilitation entscheidend. Wir halten uns an orthopädische Vorgaben, mobilisieren behutsam und steigern Belastung kontrolliert – in Abstimmung mit Operateur und Verlauf.`,
          ],
        },
      ],
    },
    {
      h2: 'Ihre Schultertherapie in Simmering',
      paragraphs: [
        `Heilgymnastik mit Fokus Scapula, Rotatorenmanschette und Thoraxmobilität; Heilmassage; Elektrotherapie; Wärme; Taping; bei Indikation <a href="stosswellentherapie-wien/">Stoßwellentherapie</a>.`,
        `Seit 1990 am Standort – Vertrauen und Kontinuität. Kassen und Privatordination. ${L.addr}, ${L.district}.`,
        `Terminvereinbarung: ${L.phone} oder <a href="../termin.html">termin.html</a>. Gesamtangebot: <a href="../therapieangebot.html">Therapieangebot</a>.`,
      ],
    },
    {
      h2: 'Schulterschmerzen in Wien 11 – Termin vereinbaren',
      paragraphs: [
        `Rufen Sie ${L.phone} an oder nutzen Sie <a href="../termin.html">termin.html</a>. Ersttermin: Anamnese, Schulter- und Nackenuntersuchung, Besprechung von Bildgebung und Therapieplan.`,
        `Bringen Sie Verordnungen und Arbeitsplatz-Infos mit (überkopfarbeit ja/nein) – relevant für Impingement und Rotatorenmanschette.`,
        `Konservative Therapie braucht Geduld – besonders bei Frozen Shoulder. Wir begleiten Sie über Monate mit planbaren Terminen in Simmering.`,
        `Verwandte Themen: <a href="nackenschmerzen-ursachen/">Nacken</a>, <a href="stosswellentherapie-wien/">Stoßwelle</a>, <a href="faszienschmerzen/">Faszien</a>. ${L.addr}.`,
      ],
    },
  ],

  'faszienschmerzen': [
    {
      h2: 'Chronifizierung vermeiden',
      paragraphs: [
        `Wer Triggerpunkte monatelang nur mit Schmerzmitteln behandelt, riskiert Chronifizierung und Nebenwirkungen. Frühe manualtherapeutische und bewegungsorientierte Intervention ist oft sinnvoller.`,
        `Stressmanagement ist kein „Nice to have“: erhöhter Muskeltonus hält Triggerpunkte aktiv. Atemübungen, Pausen und Schlafhygiene gehören ins Gesamtkonzept.`,
        `Bildschirmarbeit ohne Pausen verstärkt fasziale Spannung im Nacken-Schulter-Rücken-Kreuz – ergonomische Korrektur ist Therapie, nicht nur Arbeitsplatzgestaltung.`,
        `Wir evaluieren alle paar Wochen Fortschritt und passen Frequenz an – transparent und ohne Lock-in in endlose Serien ohne Ziel.`,
      ],
    },
    {
      h2: 'Triggerpunkte und Schmerzmuster',
      paragraphs: [
        `Triggerpunkte sind druckempfindliche Knoten in der Muskulatur, die lokale und referierte Schmerzen auslösen können – klassisch am Trapezius, Levator scapulae oder gluteal. Patientinnen und Patienten beschreiben oft „ziehende Bahnen“ oder dumpfen Druck.`,
        `Myofasziale Schmerzen sind häufig begleitet von Schlafstörung, Erschöpfung und Stress – ein multimodaler Ansatz ist sinnvoller als ein einzelner 15-Minuten-Termin ohne Kontext.`,
        `Diagnose ist klinisch: Palpation, Schmerzreproduktion, Ausschluss neurologischer und rheumatologischer Erkrankungen. MRT zeigt nicht jeden Triggerpunkt.`,
      ],
    },
    {
      h2: 'Manuelle und physikalische Therapie',
      paragraphs: [
        `Heilmassage mit myofaszialen Techniken, ischemic compression, Dehnung und Heilgymnastik zur Haltungskorrektur bilden das Kernprogramm. Wärme, Elektrotherapie und Medi-Taping können ergänzen.`,
        `Bei chronischen Sehnenansätzen, die myofaszial überlagert sind, kann <a href="stosswellentherapie-wien/">Stoßwellentherapie</a> sinnvoll sein – wir trennen klar zwischen Sehnenansatz und rein muskulärem Triggerpunkt.`,
        `Selbstbehandlung mit Foam Roller oder Massageball kann unterstützen – wir zeigen sichere Anwendung, um Nerven und Gelenke nicht zu irritieren.`,
      ],
      subsections: [
        {
          h3: 'Faszien und andere Regionen',
          paragraphs: [
            `Fasziale Schmerzen betreffen oft mehrere Regionen – Nacken, Rücken, Schulter. Unsere thematischen Seiten <a href="nackenschmerzen-ursachen/">Nacken</a>, <a href="rueckenschmerzen-wien/">Rücken</a> und <a href="schulter-schmerzen/">Schulter</a> ergänzen diese fokussierte Faszien-Seite ohne Keyword-Kannibalismus.`,
          ],
        },
      ],
    },
    {
      h2: 'Verlauf und Erwartungen in Wien 11',
      paragraphs: [
        `Myofasziale Beschwerden lösen sich selten nach einer Sitzung – realistisch sind mehrere Wochen strukturierte Therapie plus Verhaltensanpassung (Ergonomie, Stress, Schlaf).`,
        `Dr. Cenik überwacht ärztlich den Verlauf und passt Therapie an. Ordination seit 1990 in ${L.district}, ${L.addr}. ÖGK, BVAEB, SVS mit Verordnung.`,
        `Vereinbaren Sie einen Termin: ${L.phone} oder <a href="../termin.html">Online</a>. Übersicht aller Leistungen: <a href="../therapieangebot.html">Therapieangebot</a>.`,
      ],
    },
    {
      h2: 'Faszienschmerzen – Ihr Weg in unsere Ordination',
      paragraphs: [
        `Beschreiben Sie beim Termin Ihre Schmerzbahnen und Druckpunkte – das hilft bei der klinischen Zuordnung zu myofaszialen Mustern versus Gelenk- oder Nervenursachen.`,
        `Erwarten Sie ein mehrwöchiges Programm aus Heilmassage, Bewegung und Alltagsanpassung – nicht nur eine einmalige Behandlung ohne Follow-up.`,
        `Bei Nacken- oder Rückenbezug lesen Sie ergänzend <a href="nackenschmerzen-ursachen/">Nackenschmerzen Ursachen</a> und <a href="rueckenschmerzen-wien/">Rückenschmerzen Wien</a> – wir behandeln ganzheitlich, die Inhalte bleiben thematisch getrennt.`,
        `Dr. Cenik, Fachärztin, ${L.addr}, ${L.district}. Kassen ÖGK, BVAEB, SVS. ${L.phone}.`,
      ],
    },
  ],
};
