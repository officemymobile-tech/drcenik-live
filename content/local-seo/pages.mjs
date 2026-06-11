import { EXTENDED_SECTIONS } from './extended-sections.mjs';
import { SUPPLEMENT_SECTIONS } from './supplement-sections.mjs';
import { GEO } from './geo.mjs';

/** @typedef {{ q: string, a: string }} Faq */
/** @typedef {{ h3: string, paragraphs: string[] }} Subsection */
/** @typedef {{ h2: string, intro?: string, paragraphs?: string[], subsections?: Subsection[] }} Section */
/** @typedef {{ slug?: string, href?: string, title: string, desc: string }} RelatedLink */
/** @typedef {{ slug: string, title: string, metaDescription: string, h1: string, heroIntro: string, breadcrumbName: string, schemaName: string, schemaType?: string, conditionName?: string, sections: Section[], faqs: Faq[], related: RelatedLink[] }} LocalSeoPage */

const LOCAL = {
  addr: GEO.addr,
  district: GEO.district,
  region: GEO.region,
  phone: GEO.phone,
};

/** @type {RelatedLink[]} */
const baseRelated = [
  { slug: 'rueckenschmerzen-wien', title: 'Rückenschmerzen Wien', desc: 'Behandlung akuter und chronischer Rückenbeschwerden in Simmering.' },
  { slug: 'nackenschmerzen-ursachen', title: 'Nackenschmerzen – Ursachen', desc: 'Warum der Nacken verspannt und wann ärztliche Hilfe sinnvoll ist.' },
  { slug: 'knieschmerzen-behandlung', title: 'Knieschmerzen Behandlung', desc: 'Konservative Therapie bei Meniskus, Arthrose und Patellaproblemen.' },
  { slug: 'schulter-schmerzen', title: 'Schulterschmerzen', desc: 'Frozen Shoulder, Impingement und Rotatorenmanschetten-Reha.' },
  { slug: 'faszienschmerzen', title: 'Faszienschmerzen', desc: 'Myofasziale Beschwerden, Triggerpunkte und manuelle Therapie.' },
  { slug: 'stosswellentherapie-wien', title: 'Stoßwellentherapie Wien', desc: 'ESWT bei Sehnenansatz- und chronischen Schmerzen.' },
  { slug: 'r-force-therapie-wien', title: 'R-Force Therapie Wien', desc: 'Gehtraining mit Gewichtsentlastung nach Verletzung oder OP.' },
  { href: '../therapieangebot.html', title: 'Therapieangebot', desc: 'Alle Kassen- und Privatleistungen der Ordination.' },
];

function relatedFor(slug, extra = []) {
  const picks = {
    'r-force-therapie-wien': ['knieschmerzen-behandlung', 'rueckenschmerzen-wien', 'schulter-schmerzen'],
    'stosswellentherapie-wien': ['faszienschmerzen', 'knieschmerzen-behandlung', 'schulter-schmerzen'],
    'nackenschmerzen-ursachen': ['rueckenschmerzen-wien', 'faszienschmerzen', 'schulter-schmerzen'],
    'rueckenschmerzen-wien': ['nackenschmerzen-ursachen', 'faszienschmerzen', 'r-force-therapie-wien'],
    'knieschmerzen-behandlung': ['r-force-therapie-wien', 'stosswellentherapie-wien', 'rueckenschmerzen-wien'],
    'schulter-schmerzen': ['stosswellentherapie-wien', 'nackenschmerzen-ursachen', 'faszienschmerzen'],
    'faszienschmerzen': ['nackenschmerzen-ursachen', 'rueckenschmerzen-wien', 'stosswellentherapie-wien'],
  };
  const slugs = picks[slug] || [];
  const links = slugs.map((s) => baseRelated.find((r) => r.slug === s)).filter(Boolean);
  if (slug !== 'r-force-therapie-wien') {
    links.push({ href: '../r-force.html', title: 'R-Force Gerät & Technik', desc: 'Details zum Antigravitations-Laufband.' });
  } else {
    links.push({ href: '../r-force.html', title: 'R-Force Produktseite', desc: 'Technische Details, Anwendungsgebiete und Vorteile.' });
  }
  links.push({ href: '../therapieangebot.html', title: 'Therapieangebot', desc: 'Übersicht aller Leistungen der Ordination.' });
  return [...links, ...extra].filter((r, i, arr) => arr.findIndex((x) => (x.slug || x.href) === (r.slug || r.href)) === i);
}

/** @type {LocalSeoPage[]} */
export const PAGES = [
  {
    slug: 'r-force-therapie-wien',
    title: 'R-Force Therapie Wien 11 | Dr. Cenik',
    metaDescription: 'R-Force Gehtraining mit Gewichtsentlastung in Wien 11 (Simmering). Fachärztin Dr. Cenik – Rehabilitation nach OP & Verletzung. Termin: 01/7692991.',
    h1: 'R-Force Therapie in Wien 11 – Gehtraining mit Gewichtsentlastung',
    breadcrumbName: 'R-Force Therapie Wien',
    schemaName: 'R-Force Antigravitations-Gehtraining',
    schemaType: 'MedicalTherapy',
    conditionName: 'Gangstörung und Mobilitätseinschränkung',
    heroIntro: `Das R-Force Antigravitations-Laufband ermöglicht in unserer Ordination in ${LOCAL.district} kontrolliertes Gehtraining mit bis zu 100 % Gewichtsentlastung – ideal nach Knie- oder Hüftoperation, bei neurologischen Erkrankungen oder sportlichen Verletzungen. Dr. Fadime Cenik begleitet Sie fachärztlich von der Indikationsstellung bis zur progressiven Belastungssteigerung.`,
    sections: [
      {
        h2: 'Was ist R-Force und für wen ist es geeignet?',
        paragraphs: [
          `R-Force ist ein spezialisiertes Laufband in einer luftgedruckgestützten Kammer, das das Körpergewicht schrittweise entlastet. Patientinnen und Patienten können so frühzeitig und sicher wieder gehen – ohne die Gelenke und die Wirbelsäule voll zu belasten. In Wien 11 (Simmering) bieten wir diese Technologie als Teil eines ganzheitlichen Rehabilitationskonzepts an.`,
          `Typische Indikationen sind die Rehabilitation nach Kreuzband- oder Meniskus-OP, Hüft- und Knie-Endoprothesen, Frakturen der unteren Extremität, aber auch neurologische Erkrankungen wie Schlaganfall, Parkinson oder Multiple Sklerose. Sportlerinnen und Sportler profitieren bei Überlastungsreaktionen oder nach distorsiven Verletzungen von der kontrollierten Wiederbelastung.`,
          `Die Therapie ersetzt keine operative oder medikamentöse Behandlung, ergänzt diese aber sinnvoll: Ziel ist die Wiederherstellung eines stabilen, schmerzarmen Gangs und die Verbesserung von Kraft, Ausdauer und Gleichgewicht – unter fachärztlicher Aufsicht in unserer Ordination seit 1990.`,
        ],
        subsections: [
          {
            h3: 'Lokaler Vorteil: R-Force in Simmering erreichbar',
            paragraphs: [
              `Unsere Ordination in der Kaiser-Ebersdorfer-Straße 328 liegt im 11. Wiener Gemeindebezirk und ist mit Bus und Straßenbahn gut erreichbar (Station Kaiserebersdorf, Zinnergasse). Viele Patientinnen und Patienten aus Simmering, Leopoldstadt, Favoriten und dem Umland schätzen die kurzen Wege für regelmäßige Trainingseinheiten – ein wichtiger Faktor für den Therapieerfolg.`,
            ],
          },
        ],
      },
      {
        h2: 'Ablauf einer R-Force Therapie bei Dr. Cenik',
        paragraphs: [
          `Vor der ersten Einheit erfolgt eine fachärztliche Anamnese und Befunderhebung. Wir klären, ob R-Force in Ihrem Fall medizinisch sinnvoll ist, welche Belastungsstufen erreichbar sind und wie R-Force in Heilgymnastik, Manuelle Therapie oder Stoßwellentherapie eingebettet wird.`,
          `In der Kammer wird das Körpergewicht schrittweise reduziert – oft beginnt das Training bei 30–50 % Entlastung und steigt über Wochen an. Eine integrierte Kamera liefert visuelles Biofeedback zum Gangbild; motivierende Module unterstützen die Compliance. Jede Sitzung wird dokumentiert, Fortschritte sind objektiv nachvollziehbar.`,
        ],
        subsections: [
          {
            h3: 'Kassenleistung und Privatordination',
            paragraphs: [
              `Viele physiotherapeutische Leistungen sind bei ärztlicher Verordnung über ÖGK, BVAEB oder SVS abrechenbar, sofern ein Kassenvertrag besteht. R-Force kann je nach Verordnung und Indikation als Teil der Rehabilitation eingeplant werden. Für Privatpatientinnen und Privatpatienten informieren wir vorab transparent über Kosten und Therapiefrequenz – telefonisch unter ${LOCAL.phone}.`,
            ],
          },
        ],
      },
      {
        h2: 'Wissenschaftliche Einordnung und Sicherheit',
        paragraphs: [
          `Gewichtsentlastetes Laufbandtraining gehört international zur evidenzbasierten Rehabilitation des Bewegungsapparats und des neurologischen Systems. Studien zeigen Vorteile bei früher Mobilisierung, Gangqualität und subjektiver Belastbarkeit – insbesondere wenn Training früh, aber dosiert erfolgt.`,
          `Kontraindikationen wie instabile Frakturen, schwere kardiovaskuläre Einschränkungen oder akute Entzündungen werden vor Beginn ausgeschlossen. Unser Team passt Tempo, Entlastungsgrad und Dauer individuell an – Sicherheit hat Vorrang vor schnellen Fortschritten.`,
        ],
      },
      {
        h2: 'Kombination mit weiteren Therapien',
        paragraphs: [
          `R-Force wirkt am besten im Verbund: Heilgymnastik stärkt Muskulatur und Beweglichkeit, Manuelle Lymphdrainage unterstützt bei Schwellungen nach OP, Stoßwellentherapie kann bei chronischen Sehnenansatzbeschwerden sinnvoll sein. Für Rücken- oder Nackenprobleme, die den Gang beeinflussen, verweisen wir auf unsere thematischen Informationsseiten – die Behandlung bleibt jedoch stets individuell.`,
          `Ausführliche technische Informationen zum Gerät finden Sie auf unserer <a href="../r-force.html">R-Force Produktseite</a>. Für einen Termin in Wien 11 nutzen Sie <a href="../termin.html">unser Online-Formular</a> oder rufen Sie uns direkt an.`,
        ],
      },
    ],
    faqs: [
      { q: 'Wo finde ich R-Force Therapie in Wien?', a: `In der Ordination von Dr. Fadime Cenik, ${LOCAL.addr}. Wir sind seit 1990 am Standort und bieten R-Force als Teil der physikalischen Rehabilitation an.` },
      { q: 'Wie viele R-Force Einheiten brauche ich?', a: 'Das hängt von Diagnose, OP-Verlauf und Zielen ab – typischerweise 10–20 Einheiten im Rahmen einer Reha. Wir planen die Frequenz nach Erstbefund.' },
      { q: 'Übernimmt die ÖGK R-Force?', a: 'Physiotherapeutische Leistungen können bei Verordnung über ÖGK, BVAEB oder SVS abgerechnet werden. Die genaue Einordnung besprechen wir mit Ihrer Verordnung.' },
      { q: 'Ist R-Force nach einem Kreuzbandriss sinnvoll?', a: 'Ja, in der aufbauenden Phase häufig – mit progressiver Gewichtsbelastung und Gangschulung unter fachärztlicher Begleitung.' },
      { q: 'Kann ich R-Force auch ohne Operation nutzen?', a: 'Bei Überlastungssyndromen, distorsiven Verletzungen oder chronischen Knie- und Hüftbeschwerden kann gewichtsentlastetes Gehen die Belastungstoleranz verbessern.' },
      { q: 'Wie lange dauert eine Einheit?', a: 'In der Regel 30–45 Minuten inklusive Vorbereitung, Training und Nachbesprechung.' },
      { q: 'Brauche ich eine Überweisung?', a: 'Für Kassenleistungen ist eine ärztliche Verordnung erforderlich. Privatordination ist auch ohne Verordnung möglich.' },
    ],
    related: relatedFor('r-force-therapie-wien'),
  },

  {
    slug: 'stosswellentherapie-wien',
    title: 'Stoßwellentherapie Wien 11 | Dr. Cenik',
    metaDescription: 'Stoßwellentherapie (ESWT) in Wien 11 Simmering – Sehnen, Fersenschmerz, Tennisarm. Fachärztin Dr. Cenik, Kassen & Privat. Tel. 01/7692991.',
    h1: 'Stoßwellentherapie in Wien 11 – ESWT bei chronischen Beschwerden',
    breadcrumbName: 'Stoßwellentherapie Wien',
    schemaName: 'Stoßwellentherapie (ESWT)',
    schemaType: 'MedicalTherapy',
    conditionName: 'Chronische Sehnen- und Muskelansatzschmerzen',
    heroIntro: `Die fokussierte Stoßwellentherapie (ESWT) regt die Durchblutung und Regeneration bei hartnäckigen Sehnen- und Ansatzschmerzen an – etwa am Ellenbogen, der Schulter, der Ferse oder am Knie. In ${LOCAL.district} führt Dr. Fadime Cenik die Indikationsstellung fachärztlich durch und kombiniert ESWT mit Heilmassage, Heilgymnastik und weiteren physikalischen Verfahren.`,
    sections: [
      {
        h2: 'Wirkprinzip der Stoßwellentherapie',
        paragraphs: [
          `Stoßwellen sind kurze, hochenergetische Impulse, die gezielt in tieferliegendes Gewebe gelenkt werden. Dadurch können verklebte Fasern gelockert, Stoffwechselprozesse angeregt und Schmerzrezeptoren moduliert werden. Die Methode ist in der Physikalischen Medizin etabliert – besonders bei chronischen Beschwerden, die auf konservative Maßnahmen nur langsam ansprechen.`,
          `Man unterscheidet fokussierte und radiale Stoßwellen. In der orthopädischen Praxis wird je nach Region und Tiefe des Schmerzherds das passende Verfahren gewählt. Eine typische Serie umfasst mehrere Sitzungen im Abstand von etwa einer Woche.`,
        ],
        subsections: [
          {
            h3: 'Typische Einsatzgebiete in unserer Ordination',
            paragraphs: [
              `Häufig behandeln wir Tennis- und Golferellenbogen (Epicondylopathie), Fersenschmerz bei Plantarfasziitis oder Fersensporn, Achillessehnenreizungen, Patellasehnenbeschwerden, Schulteransatzschmerzen und myofasziale Triggerpunkte. Die genaue Diagnose stellen wir vor der ersten ESWT-Sitzung – gegebenenfalls mit klinischer Untersuchung und Bildgebung, die Sie mitbringen.`,
            ],
          },
        ],
      },
      {
        h2: 'Ablauf und was Sie erwartet',
        paragraphs: [
          `Nach Anamnese und körperlicher Untersuchung legen wir den Schmerzherd fest und besprechen Nutzen, Alternativen und mögliche Nebenwirkungen. Die Behandlung dauert meist 10–20 Minuten; die Intensität wird schrittweise gesteigert. Leichte Hautrötung oder Druckschmerz sind möglich und klingen in der Regel rasch ab.`,
          `Wichtig: Stoßwellentherapie ist kein „Wundermittel“, sondern ein Baustein. Ergänzend empfehlen wir oft Dehnung, eccentric loading, Taping oder Heilmassage – abgestimmt auf Ihre Alltagsbelastung in Wien und Beruf.`,
        ],
      },
      {
        h2: 'ESWT in Simmering – erreichbar und planbar',
        paragraphs: [
          `Unsere Ordination in Simmering ist für Patientinnen und Patienten aus dem 11. Bezirk und angrenzenden Stadtteilen gut mit öffentlichen Verkehrsmitteln erreichbar. Kurze Wege erleichtern die Einhaltung des Therapieplans – bei ESWT oft drei bis fünf Termine über mehrere Wochen.`,
          `Seit 1990 am Standort verbinden wir moderne physikalische Verfahren mit persönlicher Betreuung. Dr. Cenik ist Fachärztin für Physikalische Medizin und allgemeine Rehabilitation – Sie sind in ärztlicher Verantwortung, nicht in einer anonymen Gerätekette.`,
        ],
        subsections: [
          {
            h3: 'Kosten und Kassen',
            paragraphs: [
              `Je nach Indikation und Verordnung können Leistungen über ÖGK, BVAEB oder SVS abgerechnet werden; andernfalls bieten wir ESWT als Privatleistung an. Wir informieren Sie vor Beginn transparent – telefonisch unter ${LOCAL.phone} oder bei der Terminvereinbarung über <a href="../termin.html">termin.html</a>.`,
            ],
          },
        ],
      },
      {
        h2: 'Wann ESWT nicht die erste Wahl ist',
        paragraphs: [
          `Bei akuten Entzündungen, Thrombosen, Schwangerschaft, bestimmten neurologischen Ausfällen oder direkt über dem Wachstumsfugenbereich bei Jugendlichen ist Stoßwellentherapie kontraindiziert. Auch bei unklarer Diagnose klären wir zuerst die Ursache – etwa ob Schulterschmerzen von der Rotatorenmanschette oder vom zervikalen Bereich ausgehen.`,
          `Bei Rücken- oder Nackenbeschwerden ohne klaren Sehnenansatzbezug stehen andere Verfahren im Vordergrund; unsere Seite zu <a href="nackenschmerzen-ursachen/">Nackenschmerzen-Ursachen</a> hilft bei der Einordnung, die Therapie planen wir individuell.`,
        ],
      },
    ],
    faqs: [
      { q: 'Tut Stoßwellentherapie weh?', a: 'Während der Behandlung kann ein spürbarer Druck entstehen – wir steigern die Intensität behutsam. Die meisten Patientinnen und Patienten tolerieren ESWT gut.' },
      { q: 'Wie viele Sitzungen sind nötig?', a: 'Oft drei bis fünf Termine im Wochenabstand. Bei hartnäckigen Fällen kann eine zweite Serie sinnvoll sein.' },
      { q: 'Hilft ESWT bei Fersenschmerz?', a: 'Bei Plantarfasziitis und Fersensporn ist ESWT evidenzbasiert ein etablierter Baustein – kombiniert mit Dehnung und Einlagenberatung.' },
      { q: 'Kann ich danach Sport machen?', a: 'Leichte Belastung ist meist möglich; intensive Sporteinheiten pausieren wir kurz. Wir geben individuelle Empfehlungen.' },
      { q: 'Übernimmt die SVS die Kosten?', a: 'Bei ärztlicher Verordnung und bestehendem Kassenvertrag sind physikalische Leistungen oft abgedeckt – bitte vorab bei Ihrer Kasse und bei uns nachfragen.' },
      { q: 'Was ist der Unterschied zu Massage?', a: 'Massage wirkt oberflächlicher und manuell; Stoßwellen dringen gezielt tiefer und regen Regeneration am Sehnenansatz an. Beides kann kombiniert werden.' },
      { q: 'Brauche ich ein MRT vorher?', a: 'Nicht immer. Bei unklaren Beschwerden oder fehlendem Therapieansprechen kann Bildgebung sinnvoll sein – wir besprechen das im Ersttermin.' },
    ],
    related: relatedFor('stosswellentherapie-wien'),
  },

  {
    slug: 'nackenschmerzen-ursachen',
    title: 'Nackenschmerzen Ursachen Wien | Dr. Cenik',
    metaDescription: 'Nackenschmerzen Ursachen verstehen: Verspannung, HWS, Stress. Wann zum Arzt? Dr. Cenik, Fachärztin Wien 11 Simmering. Tel. 01/7692991.',
    h1: 'Nackenschmerzen – Ursachen erkennen und richtig handeln',
    breadcrumbName: 'Nackenschmerzen Ursachen',
    schemaName: 'Diagnostik und Beratung bei Nackenschmerzen',
    schemaType: 'MedicalProcedure',
    conditionName: 'Nackenschmerzen und zervikale Verspannung',
    heroIntro: `Verspannter Nacken nach langem Bildschirmarbeiten, steifer Hals nach dem Schlaf oder ziehende Schmerzen bis in den Arm – Nackenbeschwerden haben viele Auslöser. Diese Seite erklärt häufige Ursachen, Warnsignale und wann eine fachärztliche Abklärung in ${LOCAL.district} sinnvoll ist – ohne Ihre Beschwerden mit allgemeinen Rückenschmerzen zu vermischen.`,
    sections: [
      {
        h2: 'Häufige Ursachen für Nackenschmerzen',
        paragraphs: [
          `Muskuläre Verspannungen durch Fehlhaltung, einseitige Belastung oder Stress sind die häufigste Ursache. Wer viele Stunden am Monitor arbeitet, den Kopf nach vorn hält oder das Telefon auf die Schulter klemmt, überlastet die Nackenmuskulatur und die kleinen Halswirbelgelenke (HWS).`,
          `Auch psychischer Stress kann den Muskeltonus erhöhen – der „verkrampfte Nacken“ ist kein rein psychosomatisches Klischee, sondern ein messbarer muskulärer Schutzreflex. Zudem spielen degenerative Veränderungen der HWS (Bandscheiben, Uncovertebralgelenke), myofasziale Triggerpunkte und nach whiplash-artigen Beschleunigungsverletzungen strukturelle Irritationen eine Rolle.`,
        ],
        subsections: [
          {
            h3: 'Unterschied zu Rückenschmerzen',
            paragraphs: [
              `Nackenbeschwerden betreffen primär die zervikale Wirbelsäule, Schultergürtel und oft den Kopf (Kopfschmerz vom Hals). Rückenschmerzen entstehen eher thorakal oder lumbal – andere Mechanik, andere Therapieschwerpunkte. Auf unserer Seite <a href="rueckenschmerzen-wien/">Rückenschmerzen Wien</a> finden Sie gezielt Informationen zur lumbalen Behandlung.`,
            ],
          },
          {
            h3: 'Lokale Faktoren im Alltag in Wien',
            paragraphs: [
              `Pendeln mit schwerer Tasche, kalte Zugluft in öffentlichen Verkehrsmitteln oder unergonomisches Homeoffice – viele Patientinnen und Patienten aus Simmering und Umgebung berichten von Beschwerden, die mit Arbeitsweg und Bildschirmzeit zusammenhängen. Die Analyse dieser Faktoren ist Teil unserer Anamnese.`,
            ],
          },
        ],
      },
      {
        h2: 'Warnsignale – wann Sie ärztliche Hilfe brauchen',
        paragraphs: [
          `Sofort abklären lassen sollten Sie: plötzliche starke Nackenschmerzen nach Unfall, Fieber mit Nackensteifigkeit, neurologische Ausfälle (Taubheit, Kraftverlust im Arm), Gleichgewichtsstörungen, Schluckbeschwerden oder unkontrollierte Kopfschmerzen. Diese können auf ernsthafte Ursachen hinweisen und gehören nicht in die reine Massage.`,
          `Auch anhaltende Schmerzen über mehr als sechs Wochen, nächtliches Aufwachen durch Schmerz oder Ausstrahlung bis in Finger und Hand sollten fachärztlich beurteilt werden – in unserer Ordination in der Kaiser-Ebersdorfer-Straße 328 oder bei Bedarf mit Überweisung zur Bildgebung.`,
        ],
      },
      {
        h2: 'Diagnostik in der Ordination',
        paragraphs: [
          `Dr. Cenik erhebt Anamnese, untersucht Beweglichkeit, muskuläre Triggerpunkte und neurologischen Status. Mitgebrachte Befunde (MRT, Röntgen) fließen ein. Ziel ist nicht „schnell behandeln“, sondern die Ursache zu verstehen: Ist es primär muskulär-faszial, artikulär oder doch ein Nervenwurzelproblem?`,
          `Erst danach empfehlen wir ein Therapiepaket – z. B. Heilmassage, manuelle Techniken, Heilgymnastik, Wärme, Elektrotherapie oder bei faszialen Schmerzmustern gezielte Ansätze wie auf unserer Seite <a href="faszienschmerzen/">Faszienschmerzen</a> beschrieben.`,
        ],
      },
      {
        h2: 'Selbsthilfe und Prävention',
        paragraphs: [
          `Kurze Pausen, Blickführung auf Augenhöhe, ergonomischer Stuhl und regelmäßige Nacken- und Schulterdehnung können Verspannungen vorbeugen. Wärme oder sanfte Mobilisation lindern akute Episoden – jedoch nicht bei akuter Entzündung oder nach frischem Trauma ohne Abklärung.`,
          `Wenn Selbsthilfe nicht ausreicht, vereinbaren Sie einen Termin – telefonisch ${LOCAL.phone} oder über <a href="../termin.html">termin.html</a>. Kassenleistungen (ÖGK, BVAEB, SVS) sind bei Verordnung möglich.`,
        ],
      },
    ],
    faqs: [
      { q: 'Kommen Nackenschmerzen vom Stress?', a: 'Stress erhöht den Muskeltonus und verstärkt Fehlhaltungen – ein häufiger Mitfaktor, selten die einzige Ursache.' },
      { q: 'Hilft Wärme bei Nackenverspannung?', a: 'Bei muskulären Verspannungen oft ja. Bei akuter Entzündung oder Schwellung eher Kühle – wir beraten individuell.' },
      { q: 'Wann ist ein MRT nötig?', a: 'Bei neurologischen Ausfällen, Trauma, Therapieresistenz oder Verdacht auf strukturelle Schäden – nicht bei jeder Verspannung.' },
      { q: 'Sind Nackenschmerzen gefährlich?', a: 'Meist nicht – aber Warnsignale wie Fieber, Lähmung oder plötzliche starke Schmerzen erfordern sofortige Abklärung.' },
      { q: 'Kann die Heilmassage helfen?', a: 'Bei muskulär-faszialen Ursachen ist Heilmassage ein wichtiger Baustein – eingebettet in ein ganzheitliches Konzept.' },
      { q: 'Zusammenhang mit Schulterschmerzen?', a: 'Häufig – der Schultergürtel und die HWS bilden eine Einheit. Mehr dazu auf unserer Seite Schulterschmerzen.' },
      { q: 'Wie schnell bekomme ich einen Termin in Wien 11?', a: 'Rufen Sie 01 / 769 29 91 an – wir vergeben Termine zeitnah nach Dringlichkeit.' },
    ],
    related: relatedFor('nackenschmerzen-ursachen'),
  },

  {
    slug: 'rueckenschmerzen-wien',
    title: 'Rückenschmerzen Wien 11 | Dr. F. Cenik',
    metaDescription: 'Rückenschmerzen behandeln in Wien 11 Simmering: Heilgymnastik, Massage, physikalische Therapie. Dr. Cenik, Kassen ÖGK/BVAEB/SVS. 01/7692991.',
    h1: 'Rückenschmerzen in Wien 11 – konservative Behandlung & Rehabilitation',
    breadcrumbName: 'Rückenschmerzen Wien',
    schemaName: 'Behandlung von Rückenschmerzen',
    schemaType: 'MedicalTherapy',
    conditionName: 'Akute und chronische Rückenschmerzen',
    heroIntro: `Ob akuter Hexenschuss oder chronischer Kreuzschmerz: In unserer Ordination in ${LOCAL.district} bietet Dr. Fadime Cenik ein strukturiertes Behandlungskonzept – von der Befunderhebung über Heilgymnastik und Heilmassage bis zu modernen physikalischen Verfahren. Diese Seite fokussiert die Therapie lumbaler und thorakaler Rückenbeschwerden in Wien – nicht die Ursachenanalyse des Nackens.`,
    sections: [
      {
        h2: 'Formen von Rückenschmerzen',
        paragraphs: [
          `Akute Rückenschmerzen dauern weniger als sechs Wochen – oft nach Heben, Drehen oder längerem Sitzen. Chronische Beschwerden persistieren länger und beeinträchtigen Alltag und Beruf. Zuordnung nach Region (LWS, BWS), Ausstrahlung (Ischialgie) und Begleitsymptome ist die Basis jeder sinnvollen Therapie.`,
          `Häufige Diagnosen sind muskuläre Verspannungen, Facettengelenksreizungen, Bandscheibenvorwölbungen ohne radikuläre Beteiligung, degenerative Veränderungen und myofasziale Schmerzsyndrome. Eine klare Diagnose vermeidet unnötige Behandlungen und lenkt Ressourcen dorthin, wo sie wirken.`,
        ],
        subsections: [
          {
            h3: 'Rücken vs. Nacken – getrennte Wege',
            paragraphs: [
              `Zervikale Beschwerden behandeln wir mit anderem Schwerpunkt – siehe <a href="nackenschmerzen-ursachen/">Nackenschmerzen Ursachen</a>. Bei Rückenschmerzen stehen Wirbelsäulenstabilisation, Haltungsschulung und gezielte Kräftigung der Rumpfmuskulatur im Vordergrund.`,
            ],
          },
        ],
      },
      {
        h2: 'Therapieangebot bei Dr. Cenik in Simmering',
        paragraphs: [
          `Nach Anamnese und klinischer Untersuchung erstellen wir einen individuellen Plan: Heilgymnastik und Wirbelsäulengymnastik, Heilmassage, Manuelle Lymphdrainage bei Schwellungen, Elektrotherapie, Wärme, Magnetfeld- oder Lasertherapie, Medi-Taping und bei Indikation Stoßwellentherapie.`,
          `Für Patientinnen und Patienten mit Gangstörung nach OP oder neurologischer Erkrankung kann <a href="r-force-therapie-wien/">R-Force Gehtraining</a> die Belastungstoleranz verbessern – ein USP unserer Ordination in Wien 11.`,
        ],
        subsections: [
          {
            h3: 'Kassen und Terminvereinbarung',
            paragraphs: [
              `Mit Verordnung sind viele Leistungen über ÖGK, BVAEB und SVS möglich. Privatordination bieten wir parallel an. Termin: ${LOCAL.phone} oder <a href="../termin.html">Online-Anfrage</a>. Adresse: ${LOCAL.addr}.`,
            ],
          },
        ],
      },
      {
        h2: 'Aktiv bleiben – evidenzbasierte Empfehlung',
        paragraphs: [
          `Internationale Leitlinien betonen: Bei unspezifischen Rückenschmerzen ist frühe Bewegung besser als langes Bettruhe. Dosierung ist entscheidend – wir zeigen Ihnen Übungen, die Sie zu Hause und im Alltag in Wien sicher durchführen können.`,
          `Ergonomie am Arbeitsplatz, Gewichtsmanagement und regelmäßige Pausen beim Pendeln unterstützen die Therapie. Bei Verdacht auf neurologische Ausfälle oder Cauda-equina-Zeichen suchen Sie sofort eine Notfallversorgung auf – das ist unabhängig von unserer konservativen Schwerpunktsetzung.`,
        ],
      },
      {
        h2: 'Chronische Rückenschmerzen – langfristige Strategie',
        paragraphs: [
          `Chronische Schmerzen brauchen ein multimodales Konzept: körperliche Aktivierung, manuelle Therapie, Schmerzedukation und gegebenenfalls psychologische Unterstützung. Wir koordinieren die physikalische Seite und arbeiten bei Bedarf mit anderen Fachdisziplinen.`,
          `Fasziale Schmerzmuster und Triggerpunkte können Rücken und Hüfte verbinden – Informationen dazu auf <a href="faszienschmerzen/">Faszienschmerzen</a>. Das vollständige Leistungsspektrum finden Sie im <a href="../therapieangebot.html">Therapieangebot</a>.`,
        ],
      },
    ],
    faqs: [
      { q: 'Soll ich bei Rückenschmerzen liegen bleiben?', a: 'Bei unspezifischen akuten Schmerzen: kurze Schonung ja, langes Bettruhe nein. Wir empfehlen angepasste Bewegung.' },
      { q: 'Hilft Heilgymnastik bei Hexenschuss?', a: 'Nach akuter Phase und fachlicher Freigabe ist gezielte Mobilisation und Stabilisation zentral – Heilgymnastik ist ein Kernbaustein.' },
      { q: 'Wo in Wien 11 wird behandelt?', a: `Dr. Cenik, ${LOCAL.addr} – Simmering, gut erreichbar mit Bus und Bahn.` },
      { q: 'Übernimmt die ÖGK Heilmassage?', a: 'Bei ärztlicher Verordnung und Kassenvertrag oft ja – bitte vorab klären.' },
      { q: 'Wann brauche ich ein MRT?', a: 'Bei neurologischen Defiziten, Trauma, Fieber, Tumorverdacht oder Therapieresistenz – nicht routinemäßig bei jeder Rückenschmerzepisode.' },
      { q: 'Kann Stoßwelle bei Rückenschmerzen helfen?', a: 'Bei bestimmten chronischen Ansatz- oder myofaszialen Problemen ja – die Indikation stellen wir individuell.' },
      { q: 'Wie lange dauert eine Reha-Serie?', a: 'Oft 6–10 Einheiten Heilgymnastik/Massage je nach Verordnung – wir evaluieren den Fortschritt laufend.' },
    ],
    related: relatedFor('rueckenschmerzen-wien'),
  },

  {
    slug: 'knieschmerzen-behandlung',
    title: 'Knieschmerzen Behandlung Wien | Dr. Cenik',
    metaDescription: 'Knieschmerzen konservativ behandeln in Wien 11: Arthrose, Meniskus, Patella. Dr. Cenik, Physikalische Medizin, R-Force, ESWT. Tel. 01/7692991.',
    h1: 'Knieschmerzen – konservative Behandlung in Wien 11',
    breadcrumbName: 'Knieschmerzen Behandlung',
    schemaName: 'Konservative Knietherapie',
    schemaType: 'MedicalTherapy',
    conditionName: 'Knieschmerzen und Kniegelenksbeschwerden',
    heroIntro: `Schmerzen beim Treppensteigen, Knacken nach dem Sport oder Druckgefühl hinter der Kniescheibe – Kniebeschwerden sind vielfältig. In ${LOCAL.district} analysiert Dr. Fadime Cenik Ursache und Belastungsprofil und leitet ein individuelles Therapieprogramm ein – von Heilgymnastik über Stoßwellentherapie bis zum gewichtsentlasteten R-Force Gehtraining.`,
    sections: [
      {
        h2: 'Typische Ursachen von Knieschmerzen',
        paragraphs: [
          `Überlastung durch Laufen oder Arbeiten in gebückter Haltung, degenerative Gelenkveränderungen (Gonarthrose), Meniskusreizungen, Kreuzbandinstabilität nach Verletzung, Patellofemorale Beschwerden oder Entzündungen der Sehnenansätze – das Knie ist ein komplexes Gelenk, das häufig Schmerzsignale sendet.`,
          `Nicht jeder Knieschmerz braucht sofort ein MRT. Klinische Untersuchung, Anamnese und funktionelle Tests geben oft klare Hinweise. Bildgebung reservieren wir für unklare Fälle, Therapieresistenz oder OP-Planung.`,
        ],
        subsections: [
          {
            h3: 'Nach Operation und Verletzung',
            paragraphs: [
              `Nach Meniskus- oder Kreuzband-OP, Knie-TEP oder Frakturversorgung ist strukturierte Rehabilitation entscheidend. R-Force ermöglicht frühes, sicheres Gehtraining mit Gewichtsentlastung – ein Schwerpunkt unserer Ordination. Details: <a href="r-force-therapie-wien/">R-Force Therapie Wien</a>.`,
            ],
          },
        ],
      },
      {
        h2: 'Therapiemodule in unserer Ordination',
        paragraphs: [
          `Heilgymnastik zur Kräftigung von Oberschenkel- und Gesäßmuskulatur, Dehnung, Propriozeption und Gangschulung. Heilmassage und manuelle Techniken bei muskulären Verspannungen. Elektrotherapie, Kälte/Wärme, Taping und bei chronischen Sehnenproblemen <a href="stosswellentherapie-wien/">Stoßwellentherapie</a>.`,
          `Bei Gonarthrose zählen Gewichtsreduktion, Muskelaufbau und Belastungssteuerung zu den wirksamsten Maßnahmen – wir unterstützen Sie bei der Umsetzung im Alltag in Wien.`,
        ],
      },
      {
        h2: 'Knietherapie in Simmering – praxisnah',
        paragraphs: [
          `Regelmäßige Termine sind bei Knieproblemen oft nötig. Unsere Lage in Simmering mit Anbindung an Bus und Straßenbahn erleichtert die Therapietreue – ein entscheidender Erfolgsfaktor, den wir seit über drei Jahrzehnten am Standort erleben.`,
          `Dr. Cenik ist Fachärztin für Physikalische Medizin – Sie erhalten ärztliche Koordination, nicht nur Einzelmaßnahmen ohne roten Faden. Kassen: ÖGK, BVAEB, SVS bei Verordnung; Privatordination möglich.`,
        ],
      },
      {
        h2: 'Wann operative Abklärung nötig ist',
        paragraphs: [
          `Blockierungen, hartnäckige Schwellungen, Instabilität nach Trauma oder fehlendes Ansprechen auf strukturierte konservative Therapie können eine orthopädische Mitbeurteilung erfordern. Wir bleiben in konservativer Linie, empfehlen aber rechtzeitig Weiterleitung, wenn es medizinisch geboten ist.`,
          `Begleitende Rücken- oder Hüftprobleme können das Knie belasten – deshalb schauen wir ganzheitlich. Mehr zu Rücken: <a href="rueckenschmerzen-wien/">Rückenschmerzen Wien</a>.`,
        ],
      },
    ],
    faqs: [
      { q: 'Hilft R-Force bei Knieschmerzen?', a: 'Nach OP oder bei Belastungsschmerz kann gewichtsentlastetes Gehen die Toleranz verbessern – nach fachärztlicher Indikationsstellung.' },
      { q: 'Was tun bei Knieschmerzen beim Treppensteigen?', a: 'Oft Patellofemorale oder arthrotische Ursachen – Abklärung und gezielte Kräftigung (Vastus medialis) sind typische Schritte.' },
      { q: 'Ist Laufen bei Arthrose erlaubt?', a: 'Moderates Laufen auf ebenem Untergrund kann sinnvoll sein – wir passen Empfehlungen an Stadium und Schmerz an.' },
      { q: 'Wie viele Therapieeinheiten brauche ich?', a: 'Häufig 6–10 Verordnungseinheiten, bei Reha nach OP länger – mit Zwischenevaluation.' },
      { q: 'ESWT am Knie – wann?', a: 'Bei chronischen Sehnenansatzproblemen (z. B. Patellasehne) kann ESWT indiziert sein.' },
      { q: 'Brauche ich eine Überweisung vom Hausarzt?', a: 'Für Kassenphysiotherapie ja. Privat können Sie direkt Termin vereinbaren.' },
      { q: 'Wo ist die Ordination?', a: `${LOCAL.addr} – Wien 11 Simmering.` },
    ],
    related: relatedFor('knieschmerzen-behandlung'),
  },

  {
    slug: 'schulter-schmerzen',
    title: 'Schulterschmerzen Wien 11 | Dr. F. Cenik',
    metaDescription: 'Schulterschmerzen behandeln in Wien 11: Impingement, Frozen Shoulder, Sehnenreizung. Dr. Cenik, Physikalische Medizin. Termin 01/7692991.',
    h1: 'Schulterschmerzen in Wien 11 – Diagnose & konservative Therapie',
    breadcrumbName: 'Schulterschmerzen',
    schemaName: 'Behandlung von Schulterschmerzen',
    schemaType: 'MedicalTherapy',
    conditionName: 'Schulterschmerzen und Schultergürtelbeschwerden',
    heroIntro: `Eingeschränkte Beweglichkeit, nächtlicher Schmerz oder Reizung beim Heben des Arms – Schulterbeschwerden beeinträchtigen Alltag und Schlaf. In ${LOCAL.district} untersucht Dr. Fadime Cenik Schulter und angrenzende Strukturen (HWS, Schlüsselbein) und plant ein konservatives Therapieprogramm mit Heilgymnastik, Massage und physikalischen Verfahren.`,
    sections: [
      {
        h2: 'Häufige Schulterdiagnosen',
        paragraphs: [
          `Subacromiales Impingement, Rotatorenmanschettenreizung oder -ruptur (konservativ), Frozen Shoulder (idiopathische Schultersteife), AC-Gelenksarthrose, Bizepssehnenreizung oder überlagernde myofasziale Verspannungen – die Schulter ist ein häufiger Schmerzgenerator.`,
          `Schulterschmerzen können auch vom Nacken ausstrahlen. Deshalb prüfen wir die HWS – ohne Ihre Beschwerden mit einer reinen Nacken-Seite zu verwechseln; bei zervikaler Beteiligung verlinken wir auf <a href="nackenschmerzen-ursachen/">Nackenschmerzen Ursachen</a>.`,
        ],
      },
      {
        h2: 'Therapie in der Physikalischen Medizin',
        paragraphs: [
          `Schultermobilisation, scapuläre Stabilisation, Kräftigung der Rotatorenmanschette, Dehnung und Haltungsschulung sind Kern der Heilgymnastik. Heilmassage und manuelle Techniken lösen Verspannungen im Schultergürtel.`,
          `Bei chronischen Sehnenansatzproblemen kann <a href="stosswellentherapie-wien/">Stoßwellentherapie</a> ergänzend sinnvoll sein. Elektrotherapie, Wärme, Laser und Taping unterstützen die Regeneration. Wir vermeiden zu aggressive Dehnung bei akuter Entzündung.`,
        ],
        subsections: [
          {
            h3: 'Frozen Shoulder – Geduld und Struktur',
            paragraphs: [
              `Die idiopathische Schultersteife verläuft in Phasen und kann Monate dauern. Strukturierte Mobilisation und Schmerzmanagement sind wichtiger als schnelle „Durchdehnung“. Wir begleiten Sie über die Phasen hinweg – in der Ordination in Simmering mit planbaren Terminen.`,
            ],
          },
        ],
      },
      {
        h2: 'Schulterreha in Wien 11 Simmering',
        paragraphs: [
          `Seit 1990 am Standort kennen wir die Bedürfnisse von Patientinnen und Patienten aus dem 11. Bezirk und angrenzenden Gebieten. Kurze Anfahrtswege erleichtern die regelmäßige Therapie – besonders bei Schulterproblemen, wo Hausübungen und Praxis einander ergänzen müssen.`,
          `Kassenleistungen über ÖGK, BVAEB, SVS mit Verordnung; Privatordination auf Anfrage. Termin unter ${LOCAL.phone}.`,
        ],
      },
      {
        h2: 'Warnsignale und Weiterleitung',
        paragraphs: [
          `Plötzliche Kraftlosigkeit nach Sturz, Fehlstellung oder Verdacht auf komplette Sehnenruptur erfordern zeitnahe orthopädische Abklärung. Wir bleiben konservativ, empfehlen aber Bildgebung oder Spezialist, wenn es medizinisch nötig ist.`,
          `Verwandte Themen: <a href="faszienschmerzen/">Faszienschmerzen</a>, <a href="../therapieangebot.html">Therapieangebot</a>.`,
        ],
      },
    ],
    faqs: [
      { q: 'Was ist ein Impingement?', a: 'Ein Einengungssyndrom unter dem Akromion – oft mit Reizung der Sehnen. Konservative Therapie ist oft erfolgreich.' },
      { q: 'Hilft Stoßwelle an der Schulter?', a: 'Bei chronischen Sehnenansatzproblemen kann ESWT sinnvoll sein – nach klinischer Indikationsstellung.' },
      { q: 'Schulterschmerzen und Nacken – Zusammenhang?', a: 'Ja, häufig. Wir untersuchen beide Regionen systematisch.' },
      { q: 'Wie lange dauert Frozen Shoulder?', a: 'Oft 12–24 Monate – strukturierte Begleitung verkürzt Leidensdruck und verbessert Funktion.' },
      { q: 'Darf ich den Arm bei Schmerzen bewegen?', a: 'Schonende Bewegung innerhalb der Schmerzgrenze ist meist besser als totale Ruhigstellung – wir zeigen sichere Übungen.' },
      { q: 'Übernimmt die BVAEB Physiotherapie?', a: 'Bei Verordnung und Vertrag oft ja – bitte bei Ihrer Kasse und uns nachfragen.' },
      { q: 'Wo finde ich die Ordination?', a: `${LOCAL.addr}, Wien 11.` },
    ],
    related: relatedFor('schulter-schmerzen'),
  },

  {
    slug: 'faszienschmerzen',
    title: 'Faszienschmerzen Therapie Wien | Dr. Cenik',
    metaDescription: 'Faszienschmerzen & myofasziale Triggerpunkte in Wien 11 behandeln. Heilmassage, manuelle Therapie, Dr. Cenik Simmering. Tel. 01/7692991.',
    h1: 'Faszienschmerzen – myofasziale Beschwerden verstehen & behandeln',
    breadcrumbName: 'Faszienschmerzen',
    schemaName: 'Therapie myofaszialer Schmerzen',
    schemaType: 'MedicalTherapy',
    conditionName: 'Myofasziale Schmerzen und Faszienstörungen',
    heroIntro: `Druckempfindliche Triggerpunkte, ziehende Schmerzen in Muskelbahnen und ein Gefühl von „verklebtem“ Gewebe – myofasziale Beschwerden sind häufig und werden oft unterschätzt. In ${LOCAL.district} behandelt Dr. Fadime Cenik fasziale Schmerzmuster mit Heilmassage, manuellen Techniken, Heilgymnastik und ergänzenden physikalischen Verfahren – immer nach fachärztlicher Einordnung.`,
    sections: [
      {
        h2: 'Was sind Faszienschmerzen?',
        paragraphs: [
          `Faszien umhüllen Muskeln, Organe und Strukturen des Bewegungsapparats als zusammenhängendes Netzwerk. Bei Überlastung, Stress, Fehlhaltung oder nach Verletzungen können Triggerpunkte entstehen – lokale Verhärtungen, die Schmerz und verspannte Muskelfasern auslösen können.`,
          `Myofasziale Schmerzen sind oft diffus, wechseln die Lokalisation und reagieren auf Druck auf charakteristische Punkte. Sie können Nacken, Rücken, Schulter und Becken verbinden – deshalb ist eine ganzheitliche Befunderhebung wichtig, ohne alles als „Rückenschmerz“ zu etikettieren.`,
        ],
        subsections: [
          {
            h3: 'Abgrenzung zu anderen Schmerzformen',
            paragraphs: [
              `Reine Gelenkarthrose, Bandscheibenprobleme mit Neurologie oder entzündliche Rheumaerkrankungen brauchen andere Schwerpunkte. Wir differenzieren klinisch und nutzen bei Bedarf vorhandene Befunde. Für regionale Schwerpunkte: <a href="nackenschmerzen-ursachen/">Nacken</a>, <a href="rueckenschmerzen-wien/">Rücken</a>, <a href="schulter-schmerzen/">Schulter</a>.`,
            ],
          },
        ],
      },
      {
        h2: 'Therapieansätze in unserer Ordination',
        paragraphs: [
          `Heilmassage mit myofaszialen Techniken, Triggerpunkt-Behandlung, Dehnung, Heilgymnastik zur Haltungskorrektur, Wärmeanwendungen, Elektrotherapie und Medi-Taping. Bei chronischen Sehnenansätzen kann <a href="stosswellentherapie-wien/">Stoßwellentherapie</a> ergänzen.`,
          `Schmerzedukation gehört dazu: Was verstärkt Ihre Beschwerden im Wiener Alltag – Sitzen, Pendeln, Schlafposition? Kleine Verhaltensänderungen verstärken den Effekt jeder Einheit.`,
        ],
      },
      {
        h2: 'Faszientherapie in Wien 11 – erreichbar & erfahren',
        paragraphs: [
          `Manuelle Therapie braucht Regelmäßigkeit und Vertrauen. Unsere Ordination in Simmering ist seit 1990 etabliert – viele Patientinnen und Patienten schätzen Kontinuität und die Kombination aus ärztlicher und therapeutischer Expertise unter einem Dach.`,
          `Kassen: ÖGK, BVAEB, SVS mit Verordnung. Privatordination für Wahlleistungen. Anfahrt: Bus und Straßenbahn Station Kaiserebersdorf.`,
        ],
      },
      {
        h2: 'Selbsthilfe und Verlauf',
        paragraphs: [
          `Regelmäßige Bewegung, ausreichend Trinken, Stressmanagement und ergonomische Arbeitsplätze unterstützen die Therapie. Foam Rolling kann ergänzen, ersetzt aber keine fachgerechte Behandlung bei hartnäckigen Triggerpunkten.`,
          `Bei Fieber, ungewolltem Gewichtsverlust oder neurologischen Ausfällen suchen Sie ärztliche Abklärung – myofasziale Diagnosen sind Ausschlussdiagnosen nach sorgfältiger Prüfung.`,
        ],
      },
    ],
    faqs: [
      { q: 'Was sind Triggerpunkte?', a: 'Druckempfindliche Verhärtungen in der Muskulatur, die lokale und ausstrahlende Schmerzen auslösen können.' },
      { q: 'Hilft Heilmassage bei Faszienschmerzen?', a: 'Ja, myofasziale Techniken sind ein zentraler Baustein – kombiniert mit Bewegung und Haltungsschulung.' },
      { q: 'Wie lange dauert die Behandlung?', a: 'Oft mehrere Wochen mit wöchentlichen Terminen – abhängig von Chronizität und Alltagsfaktoren.' },
      { q: 'Sind Faszienschmerzen ernst?', a: 'Meist funktionell behandelbar – aber Warnsignale müssen ausgeschlossen werden.' },
      { q: 'Zusammenhang mit Stress?', a: 'Stress erhöht Muskeltonus und verstärkt Triggerpunkte – ein häufiger Mitfaktor.' },
      { q: 'Kann Stoßwelle helfen?', a: 'Bei chronischen Ansatzstellen ja; bei rein myofaszialen Triggerpunkten steht Manuelle Therapie im Vordergrund.' },
      { q: 'Termin in Simmering?', a: `${LOCAL.phone} oder online über termin.html.` },
    ],
    related: relatedFor('faszienschmerzen'),
  },
];

for (const page of PAGES) {
  const extra = EXTENDED_SECTIONS[page.slug];
  if (extra?.length) page.sections.push(...extra);
  const supplement = SUPPLEMENT_SECTIONS[page.slug];
  if (supplement?.length) page.sections.push(...supplement);
}

export const ALL_SLUGS = PAGES.map((p) => p.slug);
