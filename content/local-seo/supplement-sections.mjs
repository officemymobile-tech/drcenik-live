/** Additional sections for pages still under 1200 words */

const L = {
  addr: 'Kaiser-Ebersdorfer-Straße 328, 1110 Wien (Simmering)',
  district: 'Wien 11 (Simmering)',
  phone: '01 / 769 29 91',
};

function closingBlock(topic) {
  return {
    h2: `Ihre ${topic} – nächste Schritte in Wien 11`,
    paragraphs: [
      `Dr. Fadime Cenik ist Fachärztin für Physikalische Medizin und allgemeine Rehabilitation. Seit 1990 am Standort ${L.addr} in ${L.district} begleiten wir Patientinnen und Patienten mit evidenzorientierter, persönlicher Therapie – nicht mit anonymen Massenabfertigungen.`,
      `Kassenleistungen der ÖGK, BVAEB und SVS sind bei ärztlicher Verordnung und bestehendem Kassenvertrag möglich. Privatordination bieten wir für flexible Termine und Wahlleistungen. Kosten und Ablauf besprechen wir vor Beginn transparent.`,
      `Die Anbindung an öffentliche Verkehrsmittel (Bus 71B, 73A, 76B, Tram 11/71, Station Kaiserebersdorf) erleichtert regelmäßige Termine – ein entscheidender Faktor für Therapieerfolg bei Beschwerden des Bewegungsapparats.`,
      `Vereinbaren Sie einen Termin telefonisch unter ${L.phone} oder über <a href="../termin.html">termin.html</a>. Übersicht aller Leistungen: <a href="../therapieangebot.html">Therapieangebot</a>.`,
    ],
  };
}

/** @type {Record<string, import('./pages.mjs').Section[]>} */
export const SUPPLEMENT_SECTIONS = {
  'stosswellentherapie-wien': [
    {
      h2: 'ESWT im Vergleich zu anderen Verfahren',
      paragraphs: [
        `Spritzen können akut entzünden und sind nicht unbegrenzt wiederholbar. Physiotherapie allein braucht bei chronischen Sehnenproblemen manchmal einen zusätzlichen Stimulus – hier setzt ESWT an.`,
        `Operative Eingriffe bleiben letzte Option bei therapieresistenten Fällen – wir versuchen zuerst konservative Multimodalität in der Ordination in Simmering.`,
        `Kombination aus ESWT, exzentrischem Training und manualtherapeutischer Entlastung ist in Studien oft besser als Monotherapie – genau so planen wir Ihre Serie.`,
      ],
    },
    {
      h2: 'Patienteninformationen vor der ersten ESWT',
      paragraphs: [
        `Tragen Sie bequeme Kleidung, die den Zugang zur behandelten Region erlaubt. Schmuck im Behandlungsbereich bitte ablegen. Informieren Sie uns über Blutverdünner, Schwangerschaft, Infektionen oder implantierte Geräte – Sicherheit geht vor.`,
        `Nach der Sitzung: kein intensives Training am selben Tag; leichte Bewegung ist meist in Ordnung. Hautreaktionen sind häufig harmlos und temporär.`,
        `Wir besprechen realistische Erfolgsaussichten: ESWT wirkt bei vielen chronischen Sehnenproblemen, aber nicht bei jedem Befund. Bei fehlendem Ansprechen überdenken wir Diagnose oder empfehlen weiterführende Schritte.`,
        `Die Ordination in ${L.district} ist seit 1990 etabliert – Sie sprechen mit der Fachärztin und einem eingespielten Team, nicht mit wechselnden anonymen Behandlerinnen.`,
        `Terminvereinbarung: ${L.phone}, ${L.addr}, oder <a href="../termin.html">Online</a>.`,
      ],
    },
    closingBlock('Stoßwellentherapie'),
  ],
  'nackenschmerzen-ursachen': [
    {
      h2: 'Wann Massage hilft – und wann nicht',
      paragraphs: [
        `Bei muskulär-faszialen Verspannungen ohne neurologische Ausfälle ist Heilmassage ein bewährter Baustein – kombiniert mit Mobilisation und Eigenübungen.`,
        `Bei akutem Trauma, Fieber, Hautinfektionen oder unklarer neurologischer Symptomatik ist Massage nicht der erste Schritt – dann zählt Abklärung.`,
        `Wir verweisen bei Bedarf auf <a href="faszienschmerzen/">Faszienschmerzen</a> oder <a href="schulter-schmerzen/">Schulterschmerzen</a>, wenn der Schultergürtel mitbetroffen ist.`,
      ],
    },
    {
      h2: 'Checkliste: Nacken im Alltag entlasten',
      paragraphs: [
        `Bildschirm auf Augenhöhe, Unterarme abgestützt, Füße flach am Boden. Laptop erhöhen – nicht dauerhaft auf dem Schoß arbeiten.`,
        `Telefon: Headset oder Freisprecheinrichtung statt Schulterklemmen. Taschen gleichmäßig tragen oder Rucksack mit gepolsterten Trägern.`,
        `Pausen: alle 45–60 Minuten Schultern kreisen, Nacken sanft mobilisieren, Blick in die Ferne für Augenentspannung.`,
        `Schlaf: Kissen weder zu flach noch zu hoch – individuell unterschiedlich; wir beraten bei chronischen Nackenbeschwerden.`,
        `Bewegung: regelmäßiges Gehen in Wien (z. B. Donauufer, Park) hält HWS und Schultergürtel in Schwung – besser als komplette Schonung.`,
      ],
    },
    {
      h2: 'Beratung in der Ordination Simmering',
      paragraphs: [
        `Dr. Cenik nimmt sich Zeit für Anamnese und erklärt Befunde verständlich – ohne Angstverstärkung durch unnötige Bildgebung.`,
        `Therapieplan: Heilmassage, Heilgymnastik, physikalische Verfahren – abgestimmt auf Ihre Ursache, nicht pauschal.`,
        `Kassen ÖGK, BVAEB, SVS mit Verordnung. Privatordination möglich. ${L.phone}, ${L.addr}.`,
      ],
    },
    closingBlock('Nackenbeschwerden'),
  ],
  'rueckenschmerzen-wien': [
    {
      h2: 'Bandscheibe, Facette oder Muskel – Einordnung',
      paragraphs: [
        `Nicht jeder Rückenschmerz ist „Bandscheibe“. Muskuläre Verspannungen, Facettengelenksreizungen und myofasziale Syndrome sind mindestens ebenso häufig – die Therapie unterscheidet sich.`,
        `MRT-Befunde wie Diskusprotrusionen sind bei Menschen ohne Schmerz häufig – Korrelation mit Beschwerden ist entscheidend, nicht der Befund allein.`,
        `Wir erklären Befunde verständlich und vermeiden Angstverstärkung – aktive Therapie bleibt der Kern auch bei degenerativen Veränderungen.`,
      ],
    },
    {
      h2: 'Übungen und Alltagsintegration',
      paragraphs: [
        `Wir geben Ihnen Übungen für Zuhause – ohne teures Equipment. Rumpfstabilisation, Hüftmobilisation und sanfte Dehnung sind Kernbausteine.`,
        `Im Beruf: Steh-Sitz-Wechsel, wenn möglich; bei Schichtarbeit Mikropausen planen. Heben aus den Beinen, Last nah am Körper.`,
        `Psychosoziale Belastung verstärkt chronische Schmerzen – offene Ansprache ist Teil moderner Schmerzmedizin, kein Tabu.`,
        `Bei Übergewicht kann Gewichtsreduktion Rücken entlasten – wir unterstützen realistische Ziele ohne Moralisierung.`,
        `Rückenbeschwerden und Nackenursachen behandeln wir thematisch getrennt – siehe <a href="nackenschmerzen-ursachen/">Nackenschmerzen Ursachen</a>.`,
      ],
    },
    {
      h2: 'Warum Wien 11 Simmering als Standort',
      paragraphs: [
        `Kurze Wege für wöchentliche Physiotherapie verbessern Compliance – ein unterschätzter Erfolgsfaktor in der Reha.`,
        `Öffi-Anbindung Bus 71B, 73A, Tram 11 – wichtig für Patientinnen und Patienten ohne Auto.`,
        `Seit 1990 Kontinuität am selben Standort – Vertrauen in ärztliche Begleitung über Wochen und Monate.`,
        `Kombination aus Kassenleistung und Privatordination unter einem Dach – flexibel je nach Verordnung und Situation.`,
      ],
    },
    {
      h2: 'Rückenschmerz-Rezidiv vorbeugen',
      paragraphs: [
        `Nach Besserung: Erhaltungsprogramm mit 2–3 Übungseinheiten pro Woche – Rücken „vergisst“ Training schnell.`,
        `Arbeitgebergespräch bei schwerer körperlicher Tätigkeit kann sinnvoll sein – wir dokumentieren auf Wunsch Empfehlungen.`,
        `Bei erneutem Schub: früh wieder aktiv werden, nicht wochenlang schonen – mit fachlicher Begleitung.`,
        `Termin: ${L.phone} oder <a href="../termin.html">termin.html</a> – Ordination Dr. Cenik, ${L.addr}.`,
        `Rückenschmerzen sind kein Schicksal – mit strukturierter Therapie in Wien 11 viele Patientinnen und Patienten wieder alltagsfähig.`,
      ],
    },
    closingBlock('Rückenschmerzen'),
  ],
  'knieschmerzen-behandlung': [
    {
      h2: 'Meniskus, Kreuzband und Patella – kurz erklärt',
      paragraphs: [
        `Meniskusreizungen äußern sich oft mit Belastungsschmerz und gelegentlicher Schwellung – nicht jeder Meniskusbefund braucht OP.`,
        `Kreuzbandinstabilität führt zu Giving-way-Gefühl – Reha und Muskeltraining sind zentral; R-Force unterstützt sicheres Gehtraining in frühen Phasen.`,
        `Patellofemorale Beschwerden („Kniescheibenschmerz“) häufig bei Treppen und langem Sitzen – Quadrizeps und Hüftkräftigung sind Therapieschwerpunkte.`,
        `Gonarthrose: Belastungssteuerung, Muskelaufbau, ggf. Hilfsmittelberatung – wir begleiten über Monate, nicht nur eine Verordnungsserie.`,
      ],
    },
    {
      h2: 'Diagnostische Einordnung ohne Übertherapie',
      paragraphs: [
        `Nicht jedes Knacken ist Meniskus, nicht jeder Schmerz Arthrose. Wir unterscheiden klinisch: Schwellung, Instabilität, Blockierung, Belastungsschmerz, Nachtschmerz.`,
        `Bildgebung bestellen wir gezielt – nicht reflexartig bei jedem Erstbesuch. Das spart Kosten und vermeidet Verunsicherung durch Zufallsbefunde.`,
        `Funktionelle Tests (Treppen, Kniebeuge, Einbeinstand) sagen oft mehr über Alltagstauglichkeit als ein isolierter Schmerzscore.`,
        `Bei Verdacht auf rheumatologische oder infektiöse Ursachen leiten wir weiter – konservative Orthopädie ist unser Schwerpunkt, nicht alles.`,
      ],
    },
    {
      h2: 'Reha-Ziele nach individueller Situation',
      paragraphs: [
        `Jüngere Sportlerinnen: Return-to-Play. Ältere Patientinnen: Treppen ohne Geländer, Einkauf in Simmering, Spaziergang mit Enkelkindern.`,
        `Nach Knie-TEP: Gangschulung, Kraft, Propriozeption – R-Force kann frühe Mobilisation unterstützen.`,
        `Bei Patellaproblemen: Quadrizeps-Aufbau und Hüftstabilität – oft wichtiger als isolierte Kniebehandlung.`,
        `Termin und Adresse: ${L.phone}, ${L.addr}. Online: <a href="../termin.html">termin.html</a>.`,
      ],
    },
    {
      h2: 'Langfristige Kniegesundheit in Wien',
      paragraphs: [
        `Prävention ist günstiger als Reha: Muskelkraft, Beweglichkeit und Belastungssteuerung schützen das Knie – besonders bei Arthrose im Frühstadium.`,
        `Wir empfehlen realistische Aktivität: Radfahren und Schwimmen oft gut verträglich, harte Stop-and-Go-Sportarten dosiert steigern.`,
        `Gewichtsreduktion entlastet das Kniegelenk messbar – wir unterstützen ohne Stigmatisierung.`,
        `Bei anhaltenden Beschwerden: nicht Jahre warten – frühe konservative Therapie verbessert Prognose.`,
        `Dr. Cenik koordiniert Ihre Knietherapie in ${L.district} seit 1990 – Vertrauen und Kontinuität am Standort ${L.addr}.`,
      ],
    },
    {
      h2: 'Ihre Kniebeschwerden ernst nehmen',
      paragraphs: [
        `Viele Patientinnen und Patienten warten zu lange – frühe Physiotherapie und ärztliche Koordination verbessern die Chance auf konservativen Erfolg.`,
        `Wir besprechen Sport, Beruf und Alltag in Wien ehrlich – Therapie muss in Ihr Leben passen, nicht umgekehrt.`,
        `Kontakt: ${L.phone}. Online: <a href="../termin.html">termin.html</a>. <a href="../therapieangebot.html">Therapieangebot</a> im Überblick.`,
      ],
    },
    {
      h2: 'Hilfsmittel und Alltagsanpassung beim Knie',
      paragraphs: [
        `Tape, Orthese oder Stock temporär können Entlastung schaffen – wir beraten, ohne Hilfsmittel zu überbewerten.`,
        `Treppen und Öffi in Wien: Strategien für Belastungssteuerung im Alltag besprechen wir konkret.`,
        `Ziel bleibt Selbstständigkeit ohne Dauerhilfsmittel – wo medizinisch möglich.`,
      ],
    },
    closingBlock('Knieschmerzen'),
    {
      h2: 'Knietherapie – häufige Patientenfragen in der Praxis',
      paragraphs: [
        `„Muss ich sofort ein MRT machen?“ – nicht bei jedem Knieschmerz. Wir entscheiden klinisch.`,
        `„Kann ich noch wandern?“ – oft ja, dosiert – wir geben konkrete Empfehlungen für Wiener Umgebung und Alpen.`,
      ],
    },
  ],
  'schulter-schmerzen': [
    {
      h2: 'Rotatorenmanschette im Alltag',
      paragraphs: [
        `Alltagsbewegungen wie Anziehen, Haare kämmen oder Regal erreichen beanspruchen die Rotatorenmanschette – Therapie muss funktionell sein, nicht nur Übungen am Gerät.`,
        `Kraftdefizite der äußeren Rotatoren und Skapulastabilisatoren sind häufig – wir testen und trainieren gezielt.`,
        `Überkopfarbeit in der Berufung (Malerin, Elektrikerin, Friseurin) erfordert angepasste Return-to-Work-Planung.`,
        `Chronische Sehnenansatzprobleme: <a href="stosswellentherapie-wien/">Stoßwellentherapie</a> als Option nach Abklärung.`,
      ],
    },
    {
      h2: 'Phasen der Schultertherapie',
      paragraphs: [
        `Akute Phase: Schmerzreduktion, Entzündungskontrolle, keine aggressive Dehnung. Subakute Phase: Mobilisation, erste Kräftigung. Aufbauphase: funktionelle Belastung, Return-to-Activity.`,
        `Wir halten uns an dieses Phasenmodell – Überdehnung in der akuten Phase verschlechtert oft die Prognose.`,
        `Hausübungen sind Pflicht, nicht Option: 10–15 Minuten täglich schlagen eine einzelne Wochenstunde in der Praxis.`,
        `Bei Impingement: Haltungskorrektur und Schulterblattführung im Alltag (Bildschirmarbeit, Schlafposition).`,
      ],
    },
    {
      h2: 'Schulter und Sport in Wien',
      paragraphs: [
        `Schwimmen, Crossfit, Yoga, Handball – jede Sportart belastet die Schulter anders. Wir passen Empfehlungen an Ihre Disziplin an.`,
        `Überkopfsport in der akuten Phase meiden, in der Aufbauphase schrittweise zurück – mit klaren Kriterien, nicht nach Gefühl allein.`,
        `ESWT bei chronischen Sehnenansätzen: <a href="stosswellentherapie-wien/">Stoßwellentherapie Wien</a>. Fasziale Verspannungen: <a href="faszienschmerzen/">Faszienschmerzen</a>.`,
        `Dr. Cenik, Fachärztin, ${L.district}. ${L.phone}.`,
      ],
    },
    {
      h2: 'Langfristige Schulterfunktion erhalten',
      paragraphs: [
        `Nach konservativer Therapie: Erhaltungsübungen 2–3× pro Woche – Schulter vergisst Training schnell.`,
        `Arbeitsplatzanpassung (höhenverstellbarer Schreibtisch, Tool-Balance) verhindert Rezidive bei Impingement.`,
        `Bei Frozen Shoulder: realistische Zeitachse besprechen – Frustration ist normal, Struktur hilft.`,
        `Wir messen Fortschritt an Alltagsaufgaben: Anziehen, Regal, Schlaf – nicht nur Gradzahlen.`,
        `Ordination ${L.addr} – Termin ${L.phone} oder <a href="../termin.html">Online</a>. Kassen ÖGK, BVAEB, SVS.`,
      ],
    },
    {
      h2: 'Wann Sie mit Schulterschmerzen zu uns kommen',
      paragraphs: [
        `Nächtlicher Schmerz, eingeschränkte Beweglichkeit über Wochen, Kraftverlust beim Heben – das sind klare Signale für Abklärung, nicht „abwarten“.`,
        `Wir beginnen konservativ und strukturiert – mit klaren Zielen und realistischen Zeitachsen, besonders bei Frozen Shoulder.`,
        `Adresse ${L.addr}, ${L.district}. Fachärztin Dr. Fadime Cenik.`,
      ],
    },
    {
      h2: 'Schultertherapie und Erwartungsmanagement',
      paragraphs: [
        `Konservative Therapie braucht Zeit – wir kommunizieren Meilensteine statt leerer Versprechen.`,
        `Bildgebung besprechen wir, wenn klinisch nötig – nicht zur Beruhigung ohne Indikation.`,
        `Hausübungen mit Video oder Skizze – damit Sie zwischen Terminen in Simmering sicher trainieren.`,
        `Bei Nacken-Schulter-Kombination: <a href="nackenschmerzen-ursachen/">Nackenursachen</a> lesen, Behandlung bleibt individuell.`,
      ],
    },
    closingBlock('Schulterschmerzen'),
    {
      h2: 'Schulter und Beruf in Wien',
      paragraphs: [
        `Ob Büro in der Innenstadt oder Handwerk in Simmering – Belastungsanalyse ist Teil der Therapie.`,
        `Wir dokumentieren auf Wunsch Empfehlungen für Arbeitsplatzanpassung und stufenweise Wiedereingliederung.`,
        `Schultertherapie in ${L.district}: persönlich, strukturiert, seit 1990 – ${L.phone}.`,
        `Bringen Sie Verordnungen und Bildgebung mit – das beschleunigt den Start in der Ordination in der Kaiser-Ebersdorfer-Straße.`,
      ],
    },
  ],
  'faszienschmerzen': [
    {
      h2: 'Faszien, Stress und Schlaf',
      paragraphs: [
        `Schlechter Schlaf senkt Schmerzschwelle – Triggerpunkte werden empfindlicher. Schlafhygiene ist Teil des Konzepts, nicht optional.`,
        `Stress erhöht Muskeltonus im Nacken-Schulter-Bereich – Atemübungen und Pausen sind medizinisch sinnvoll.`,
        `Chronische fasziale Beschwerden ohne strukturelle Erkrankung profitieren von regelmäßiger manueller Therapie plus Aktivierung – nicht von Dauerruhe.`,
        `Bei Nackenbezug: <a href="nackenschmerzen-ursachen/">Nackenschmerzen Ursachen</a>. Bei Rückenbezug: <a href="rueckenschmerzen-wien/">Rückenschmerzen Wien</a>.`,
      ],
    },
    {
      h2: 'Unterschied myofaszial vs. fibromyalgie',
      paragraphs: [
        `Myofasziale Triggerpunkte sind lokal druckempfindlich und können referierte Schmerzen auslösen – behandelbar mit manueller Therapie und Bewegung.`,
        `Fibromyalgie ist ein eigenständiges Syndrom mit generalisiertem Schmerz, Schlafstörung und Erschöpfung – braucht oft multimodales, interdisziplinäres Management.`,
        `Wir differenzieren klinisch und vermeiden falsche Etikettierung – wichtig für realistische Erwartungen und Therapiewahl.`,
        `Bei Verdacht auf Fibromyalgie oder systemische Erkrankungen leiten wir bei Bedarf weiter.`,
      ],
    },
    {
      h2: 'Manuelle Therapie – was Sie erwartet',
      paragraphs: [
        `Gezielter Druck auf Triggerpunkte, myofasziale Dehnung, postisometrische Relaxation – Techniken nach Befund, nicht nach Mode.`,
        `Schmerz während Behandlung sollte erträglich sein – „no pain no gain“ gilt nicht. Wir kommunizieren offen über Intensität.`,
        `Nachbehandlung: leichte Bewegung, ausreichend trinken, kein extremes Training am selben Abend.`,
        `Serien über 4–8 Wochen sind üblich – mit Zwischenevaluation. ${L.addr}, ${L.phone}.`,
      ],
    },
    {
      h2: 'Faszientherapie langfristig denken',
      paragraphs: [
        `Einmalige Massage ohne Bewegung und Ergonomie führt oft zu kurzem Effekt – wir planen Serien und Hausprogramme.`,
        `Yoga und Pilates können ergänzen, ersetzen aber nicht gezielte Triggerpunkt-Arbeit bei hartnäckigen Befunden.`,
        `Ernährung und Hydration beeinflussen Gewebeelastizität – keine Wunderkur, aber sinnvoller Baustein.`,
        `Bei Schulter-Nacken-Kreuz: kombinierte Lesung unserer Seiten <a href="schulter-schmerzen/">Schulter</a> und <a href="nackenschmerzen-ursachen/">Nacken</a> – Behandlung bleibt individuell.`,
        `Seit 1990 in Simmering – Dr. Fadime Cenik, Fachärztin für Physikalische Medizin. ${L.phone}.`,
      ],
    },
    {
      h2: 'Myofasziale Beschwerden aktiv angehen',
      paragraphs: [
        `Wer monatelang nur Schmerzmittel nimmt, verpasst oft die beste Phase für manuelle Therapie und Bewegung.`,
        `Wir planen realistische Serien – mit Evaluation alle paar Wochen und Anpassung der Technik.`,
        `Kassenpatientinnen mit Verordnung willkommen; Privatordination für flexible Termine.`,
        `Kontakt ${L.phone}, ${L.addr} – <a href="../termin.html">Termin online</a>.`,
      ],
    },
    closingBlock('Faszienschmerzen'),
    {
      h2: 'Faszien und Bewegung im Alltag',
      paragraphs: [
        `Kurze Spaziergänge, Dehnpausen am Arbeitsplatz und ausreichend Flüssigkeit unterstützen die manuelle Therapie zwischen Terminen.`,
        `Wir zeigen sichere Eigenübungen – ohne Überlastung am ersten Tag nach der Behandlung.`,
        `Faszientherapie bei Dr. Cenik in Simmering – Termin ${L.phone} oder <a href="../termin.html">Online</a>.`,
        `Kassen ÖGK, BVAEB und SVS mit Verordnung – Privatordination für flexible Wahltermine ohne lange Wartezeit.`,
        `Adresse: ${L.addr} in ${L.district}, gut erreichbar mit Bus und Straßenbahn.`,
      ],
    },
  ],
};
