import type { Locale } from '../state/stores'

export type UiCopy = {
  language: string
  header: {
    brandLabel: string
    lesson: (id: number) => string
    handbook: string
    courseMap: string
    progressLabel: string
    progress: (done: number, total: number) => string
    lessonState: (id: number, title: string, state: 'complete' | 'open' | 'locked') => string
  }
  course: {
    eyebrow: string
    title: string
    description: string
    allComplete: string
    start: string
    continue: (id: number) => string
    lessonsLabel: string
    complete: string
    ready: string
    locked: string
    unlock: (id: number) => string
    resetAll: string
    resetQuestion: string
    erase: string
    cancel: string
  }
  lesson: {
    notFound: string
    notFoundBody: (id: string, total: number) => string
    back: string
    lockedTitle: (id: number) => string
    lockedBody: (beforeId: number, beforeTitle: string, title: string) => string
    goTo: (id: number) => string
  }
  sidebar: {
    label: string
    views: string
    instructions: string
    files: string
    expand: string
    collapse: string
    yourTask: string
    checklist: string
    hints: string
    showAnother: string
    keyIdea: string
    editThis: string
    supplied: string
    suppliedHelp: string
  }
  prediction: {
    label: string
    heading: string
    options: string
    yes: string
    wrong: (answer: string) => string
  }
  checklist: {
    label: string
    passed: string
    failed: string
    pending: string
  }
  workspace: {
    panels: string
    panelLesson: string
    panelCode: string
    panelPreview: string
    editor: string
    editorFor: (filename: string) => string
    runShortcut: string
    leaveEditor: string
    previewAndInspector: string
    livePreview: string
    paused: string
    upToDate: string
    updating: string
    previewWidth: string
    fullWidth: string
    phoneWidth: string
    startingPreview: string
    resetQuestion: string
    yesReset: string
    cancel: string
    reset: string
    hint: string
    hintCount: (shown: number, total: number) => string
    runningChecks: string
    runChecks: string
    checksPassed: (passed: number, total: number) => string
    notRun: string
    editedAfter: string
    nextLesson: string
    finishCourse: string
    passToContinue: string
    resetAnnouncement: string
    allPassedAnnouncement: (count: number) => string
    somePassedAnnouncement: (passed: number, total: number) => string
    syntaxFirst: (where: string, message: string) => string
    line: (line: number) => string
    checksTimedOut: string
    objectiveUnchecked: string
    syntaxError: (where: string, message: string) => string
    loopError: string
    startError: string
    runtimeError: (message: string) => string
  }
  inspector: {
    title: string
    note: string
    noState: string
    waiting: string
  }
  handbook: {
    hero: string
    title: string
    sectionOne: string
    component: string
    state: string
    memoryTitle: string
    memoryBody: string
    anatomy: string
    currentValue: string
    requestsUpdate: string
    startingValue: string
    sectionTwo: string
    patternsTitle: string
    replaceTitle: string
    replaceRule: string
    object: string
    array: string
    dont: string
    do: string
    previousTitle: string
    previousRule: string
    parentTitle: string
    parentRule: string
    parentState: string
    child: string
    valueDown: string
    callbackUp: string
    queuedValues: string
    parentFlow: string
    correctObject: string
    correctArray: string
    codeExample: string
    startLesson: string
    back: string
    continueLabel: string
  }
}

export const uiCopy: Record<Locale, UiCopy> = {
  en: {
    language: 'Language',
    header: {
      brandLabel: 'State Quest, course map', lesson: id => `Lesson ${id}`, handbook: 'Handbook', courseMap: 'Course map',
      progressLabel: 'Lesson progress', progress: (done, total) => `${done} of ${total} complete`,
      lessonState: (id, title, state) => `Lesson ${id}: ${title}${state === 'complete' ? ', complete' : state === 'locked' ? ', locked' : ''}`,
    },
    course: {
      eyebrow: 'React state, hands on', title: 'Learn state by finishing real features',
      description: 'Nine short exercises across three small projects. Edit real React code, watch the live preview respond, and pass behaviour checks. Your progress and drafts stay in this browser.',
      allComplete: 'All nine lessons complete.', start: 'Start lesson 1', continue: id => `Continue with lesson ${id}`, lessonsLabel: 'Lessons',
      complete: 'Complete', ready: 'Ready', locked: 'Locked', unlock: id => `Complete lesson ${id} to unlock.`, resetAll: 'Reset all progress',
      resetQuestion: 'Erase all progress and saved code in this browser?', erase: 'Yes, erase', cancel: 'Cancel',
    },
    lesson: {
      notFound: 'Lesson not found', notFoundBody: (id, total) => `There is no lesson “${id}”. Lessons are numbered 1 to ${total}.`, back: 'Back to the course map',
      lockedTitle: id => `Lesson ${id} is locked`, lockedBody: (id, before, title) => `Finish lesson ${id}, “${before}”, to unlock “${title}”.`, goTo: id => `Go to lesson ${id}`,
    },
    sidebar: {
      label: 'Lesson sidebar', views: 'Sidebar views', instructions: 'Instructions', files: 'Files', expand: 'Expand sidebar', collapse: 'Collapse sidebar',
      yourTask: 'Your task', checklist: 'Checklist', hints: 'Hints', showAnother: 'Show another hint', keyIdea: 'Key idea', editThis: 'You edit this', supplied: 'Supplied',
      suppliedHelp: 'Styling is supplied so you can focus on React. The lesson lives in a single component file, and the preview renders whatever it exports as default.',
    },
    prediction: { label: 'Prediction', heading: 'Predict first', options: 'Your prediction', yes: 'Yes.', wrong: answer => `Not quite: the answer is ${answer}.` },
    checklist: { label: 'Objectives', passed: 'passed', failed: 'not yet', pending: 'not checked yet' },
    workspace: {
      panels: 'Workspace panels', panelLesson: 'Lesson', panelCode: 'Code', panelPreview: 'Preview', editor: 'Code editor', editorFor: file => `Code editor for ${file}`,
      runShortcut: 'Ctrl+Enter runs checks', leaveEditor: 'Esc then Tab leaves the editor', previewAndInspector: 'Preview and inspector', livePreview: 'Live preview',
      paused: 'Paused: fix the error', upToDate: 'Up to date', updating: 'Updating…', previewWidth: 'Preview width', fullWidth: 'Full width', phoneWidth: 'Phone width',
      startingPreview: 'Starting preview…', resetQuestion: 'Discard your code for this lesson?', yesReset: 'Yes, reset', cancel: 'Cancel', reset: 'Reset', hint: 'Hint',
      hintCount: (shown, total) => `Hint (${shown}/${total})`, runningChecks: 'Running checks…', runChecks: 'Run checks', checksPassed: (passed, total) => `${passed} of ${total} checks passed`,
      notRun: 'Checks not run yet', editedAfter: 'Completed. Run checks again after editing', nextLesson: 'Next lesson', finishCourse: 'Finish course', passToContinue: 'Pass every check to continue.',
      resetAnnouncement: 'Code reset to the starting point.', allPassedAnnouncement: count => `All ${count} checks passed. Lesson complete.`,
      somePassedAnnouncement: (passed, total) => `${passed} of ${total} checks passed.`, syntaxFirst: (where, message) => `Fix the syntax error${where} first: ${message}`,
      line: line => ` on line ${line}`, checksTimedOut: 'The checks did not finish. Look for a loop that never ends.', objectiveUnchecked: 'This objective could not be checked.',
      syntaxError: (where, message) => `Syntax error${where}: ${message}. Showing the last working preview.`, loopError: 'The preview stopped responding. Check for a loop that never ends.',
      startError: 'The preview could not start. Edit the code to try again, or reload the page.', runtimeError: message => `Runtime error: ${message}`,
    },
    inspector: { title: 'State inspector', note: 'Values React is holding', noState: 'No state yet. Components appear here once they call useState.', waiting: 'Waiting for the preview…' },
    handbook: {
      hero: 'React state / Quick reference', title: 'Handbook', sectionOne: '01 / State at a glance', component: 'Component', state: 'state', memoryTitle: 'State is memory',
      memoryBody: 'A value a component keeps between renders.', anatomy: 'useState anatomy', currentValue: 'current value', requestsUpdate: 'requests an update', startingValue: 'starting value',
      sectionTwo: '02 / Use in real projects', patternsTitle: 'Three patterns to remember', replaceTitle: 'Replace objects and arrays—don’t mutate them',
      replaceRule: 'Treat state as read-only. Give the setter a new value.', object: 'Object', array: 'Array', dont: 'Don’t', do: 'Do',
      previousTitle: 'When next state depends on previous state', previousRule: 'Pass an updater function.', parentTitle: 'Update parent state from a child',
      parentRule: 'Value down. Callback up. One source of truth.', parentState: 'Parent state', child: 'Child', valueDown: 'value ↓', callbackUp: 'callback ↑',
      queuedValues: 'Queued values progress from zero to three', parentFlow: 'Parent passes the value down and the child calls the callback up',
      correctObject: 'Correct object update', correctArray: 'Correct array update', codeExample: 'Code example', startLesson: 'Start lesson 1', back: 'Back to the course', continueLabel: 'Continue learning',
    },
  },
  fr: {
    language: 'Langue',
    header: {
      brandLabel: 'State Quest, plan du cours', lesson: id => `Leçon ${id}`, handbook: 'Guide', courseMap: 'Plan du cours',
      progressLabel: 'Progression des leçons', progress: (done, total) => `${done} sur ${total} terminées`,
      lessonState: (id, title, state) => `Leçon ${id} : ${title}${state === 'complete' ? ', terminée' : state === 'locked' ? ', verrouillée' : ''}`,
    },
    course: {
      eyebrow: 'L’état React, par la pratique', title: 'Apprenez l’état en réalisant de vraies fonctionnalités',
      description: 'Neuf exercices courts répartis sur trois petits projets. Modifiez du vrai code React, observez l’aperçu en direct et réussissez les vérifications. Votre progression et vos brouillons restent dans ce navigateur.',
      allComplete: 'Les neuf leçons sont terminées.', start: 'Commencer la leçon 1', continue: id => `Continuer avec la leçon ${id}`, lessonsLabel: 'Leçons',
      complete: 'Terminée', ready: 'Prête', locked: 'Verrouillée', unlock: id => `Terminez la leçon ${id} pour déverrouiller.`, resetAll: 'Réinitialiser toute la progression',
      resetQuestion: 'Effacer toute la progression et le code enregistré dans ce navigateur ?', erase: 'Oui, effacer', cancel: 'Annuler',
    },
    lesson: {
      notFound: 'Leçon introuvable', notFoundBody: (id, total) => `La leçon « ${id} » n’existe pas. Les leçons vont de 1 à ${total}.`, back: 'Retour au plan du cours',
      lockedTitle: id => `La leçon ${id} est verrouillée`, lockedBody: (id, before, title) => `Terminez la leçon ${id}, « ${before} », pour déverrouiller « ${title} ».`, goTo: id => `Aller à la leçon ${id}`,
    },
    sidebar: {
      label: 'Barre latérale de la leçon', views: 'Vues de la barre latérale', instructions: 'Consignes', files: 'Fichiers', expand: 'Développer la barre latérale', collapse: 'Réduire la barre latérale',
      yourTask: 'Votre mission', checklist: 'Liste de contrôle', hints: 'Indices', showAnother: 'Afficher un autre indice', keyIdea: 'Idée clé', editThis: 'À modifier', supplied: 'Fourni',
      suppliedHelp: 'Le style est fourni pour vous permettre de vous concentrer sur React. La leçon tient dans un seul composant et l’aperçu affiche son export par défaut.',
    },
    prediction: { label: 'Prédiction', heading: 'Prédisez d’abord', options: 'Votre prédiction', yes: 'Oui.', wrong: answer => `Pas tout à fait : la réponse est ${answer}.` },
    checklist: { label: 'Objectifs', passed: 'réussi', failed: 'pas encore', pending: 'pas encore vérifié' },
    workspace: {
      panels: 'Panneaux de travail', panelLesson: 'Leçon', panelCode: 'Code', panelPreview: 'Aperçu', editor: 'Éditeur de code', editorFor: file => `Éditeur de code pour ${file}`,
      runShortcut: 'Ctrl+Entrée lance les vérifications', leaveEditor: 'Échap puis Tab quitte l’éditeur', previewAndInspector: 'Aperçu et inspecteur', livePreview: 'Aperçu en direct',
      paused: 'En pause : corrigez l’erreur', upToDate: 'À jour', updating: 'Mise à jour…', previewWidth: 'Largeur de l’aperçu', fullWidth: 'Pleine largeur', phoneWidth: 'Largeur mobile',
      startingPreview: 'Démarrage de l’aperçu…', resetQuestion: 'Abandonner votre code pour cette leçon ?', yesReset: 'Oui, réinitialiser', cancel: 'Annuler', reset: 'Réinitialiser', hint: 'Indice',
      hintCount: (shown, total) => `Indice (${shown}/${total})`, runningChecks: 'Vérification…', runChecks: 'Lancer les vérifications', checksPassed: (passed, total) => `${passed} vérifications réussies sur ${total}`,
      notRun: 'Vérifications non lancées', editedAfter: 'Terminée. Relancez les vérifications après modification', nextLesson: 'Leçon suivante', finishCourse: 'Terminer le cours', passToContinue: 'Réussissez toutes les vérifications pour continuer.',
      resetAnnouncement: 'Code réinitialisé à sa version de départ.', allPassedAnnouncement: count => `Les ${count} vérifications sont réussies. Leçon terminée.`,
      somePassedAnnouncement: (passed, total) => `${passed} vérifications réussies sur ${total}.`, syntaxFirst: (where, message) => `Corrigez d’abord l’erreur de syntaxe${where} : ${message}`,
      line: line => ` à la ligne ${line}`, checksTimedOut: 'Les vérifications n’ont pas abouti. Cherchez une boucle qui ne se termine jamais.', objectiveUnchecked: 'Cet objectif n’a pas pu être vérifié.',
      syntaxError: (where, message) => `Erreur de syntaxe${where} : ${message}. Le dernier aperçu fonctionnel reste affiché.`, loopError: 'L’aperçu ne répond plus. Cherchez une boucle qui ne se termine jamais.',
      startError: 'L’aperçu n’a pas pu démarrer. Modifiez le code pour réessayer ou rechargez la page.', runtimeError: message => `Erreur d’exécution : ${message}`,
    },
    inspector: { title: 'Inspecteur d’état', note: 'Valeurs conservées par React', noState: 'Aucun état pour le moment. Les composants apparaissent ici dès qu’ils appellent useState.', waiting: 'En attente de l’aperçu…' },
    handbook: {
      hero: 'État React / Aide-mémoire', title: 'Guide', sectionOne: '01 / L’état en un coup d’œil', component: 'Composant', state: 'état', memoryTitle: 'L’état est une mémoire',
      memoryBody: 'Une valeur qu’un composant conserve entre les rendus.', anatomy: 'Anatomie de useState', currentValue: 'valeur actuelle', requestsUpdate: 'demande une mise à jour', startingValue: 'valeur initiale',
      sectionTwo: '02 / Dans de vrais projets', patternsTitle: 'Trois modèles à retenir', replaceTitle: 'Remplacez les objets et tableaux — ne les modifiez pas directement',
      replaceRule: 'Traitez l’état comme une valeur en lecture seule. Donnez une nouvelle valeur au setter.', object: 'Objet', array: 'Tableau', dont: 'À éviter', do: 'À faire',
      previousTitle: 'Quand le prochain état dépend du précédent', previousRule: 'Passez une fonction de mise à jour.', parentTitle: 'Mettre à jour l’état parent depuis un enfant',
      parentRule: 'Valeur vers le bas. Callback vers le haut. Une seule source de vérité.', parentState: 'État parent', child: 'Enfant', valueDown: 'valeur ↓', callbackUp: 'callback ↑',
      queuedValues: 'Les valeurs en file passent de zéro à trois', parentFlow: 'Le parent transmet la valeur et l’enfant appelle le callback',
      correctObject: 'Mise à jour correcte d’un objet', correctArray: 'Mise à jour correcte d’un tableau', codeExample: 'Exemple de code', startLesson: 'Commencer la leçon 1', back: 'Retour au cours', continueLabel: 'Continuer à apprendre',
    },
  },
  ar: {
    language: 'اللغة',
    header: {
      brandLabel: 'State Quest، خريطة الدورة', lesson: id => `الدرس ${id}`, handbook: 'الدليل', courseMap: 'خريطة الدورة',
      progressLabel: 'تقدّم الدروس', progress: (done, total) => `اكتمل ${done} من ${total}`,
      lessonState: (id, title, state) => `الدرس ${id}: ${title}${state === 'complete' ? '، مكتمل' : state === 'locked' ? '، مقفل' : ''}`,
    },
    course: {
      eyebrow: 'حالة React بالتطبيق العملي', title: 'تعلّم الحالة بإكمال ميزات حقيقية',
      description: 'تسعة تمارين قصيرة ضمن ثلاثة مشاريع صغيرة. عدّل كود React حقيقيًا، وشاهد استجابة المعاينة المباشرة، واجتز اختبارات السلوك. يُحفظ تقدّمك ومسوداتك في هذا المتصفح.',
      allComplete: 'اكتملت الدروس التسعة.', start: 'ابدأ الدرس 1', continue: id => `تابع إلى الدرس ${id}`, lessonsLabel: 'الدروس',
      complete: 'مكتمل', ready: 'جاهز', locked: 'مقفل', unlock: id => `أكمل الدرس ${id} لفتحه.`, resetAll: 'إعادة ضبط كل التقدّم',
      resetQuestion: 'هل تريد مسح كل التقدّم والكود المحفوظ في هذا المتصفح؟', erase: 'نعم، امسح', cancel: 'إلغاء',
    },
    lesson: {
      notFound: 'الدرس غير موجود', notFoundBody: (id, total) => `لا يوجد درس باسم «${id}». أرقام الدروس من 1 إلى ${total}.`, back: 'العودة إلى خريطة الدورة',
      lockedTitle: id => `الدرس ${id} مقفل`, lockedBody: (id, before, title) => `أكمل الدرس ${id}، «${before}»، لفتح «${title}».`, goTo: id => `اذهب إلى الدرس ${id}`,
    },
    sidebar: {
      label: 'الشريط الجانبي للدرس', views: 'عروض الشريط الجانبي', instructions: 'التعليمات', files: 'الملفات', expand: 'توسيع الشريط الجانبي', collapse: 'طي الشريط الجانبي',
      yourTask: 'مهمتك', checklist: 'قائمة التحقق', hints: 'تلميحات', showAnother: 'عرض تلميح آخر', keyIdea: 'الفكرة الأساسية', editThis: 'ستعدّل هذا', supplied: 'مرفق',
      suppliedHelp: 'التنسيق مرفق كي تركّز على React. يوجد الدرس في ملف مكوّن واحد، وتعرض المعاينة ما يصدّره كقيمة افتراضية.',
    },
    prediction: { label: 'توقّع', heading: 'توقّع أولًا', options: 'توقّعك', yes: 'صحيح.', wrong: answer => `ليس تمامًا: الإجابة هي ${answer}.` },
    checklist: { label: 'الأهداف', passed: 'ناجح', failed: 'ليس بعد', pending: 'لم يُفحص بعد' },
    workspace: {
      panels: 'لوحات مساحة العمل', panelLesson: 'الدرس', panelCode: 'الكود', panelPreview: 'المعاينة', editor: 'محرر الكود', editorFor: file => `محرر الكود للملف ${file}`,
      runShortcut: 'Ctrl+Enter يشغّل الاختبارات', leaveEditor: 'اضغط Esc ثم Tab لمغادرة المحرر', previewAndInspector: 'المعاينة وفاحص الحالة', livePreview: 'المعاينة المباشرة',
      paused: 'متوقفة: أصلح الخطأ', upToDate: 'محدّثة', updating: 'جارٍ التحديث…', previewWidth: 'عرض المعاينة', fullWidth: 'العرض الكامل', phoneWidth: 'عرض الهاتف',
      startingPreview: 'جارٍ بدء المعاينة…', resetQuestion: 'هل تريد تجاهل كودك في هذا الدرس؟', yesReset: 'نعم، أعد الضبط', cancel: 'إلغاء', reset: 'إعادة ضبط', hint: 'تلميح',
      hintCount: (shown, total) => `تلميح (${shown}/${total})`, runningChecks: 'جارٍ تشغيل الاختبارات…', runChecks: 'تشغيل الاختبارات', checksPassed: (passed, total) => `نجح ${passed} من ${total} اختبارات`,
      notRun: 'لم تُشغّل الاختبارات بعد', editedAfter: 'مكتمل. شغّل الاختبارات مجددًا بعد التعديل', nextLesson: 'الدرس التالي', finishCourse: 'إنهاء الدورة', passToContinue: 'اجتز كل الاختبارات للمتابعة.',
      resetAnnouncement: 'أُعيد الكود إلى نقطة البداية.', allPassedAnnouncement: count => `نجحت الاختبارات وعددها ${count}. اكتمل الدرس.`,
      somePassedAnnouncement: (passed, total) => `نجح ${passed} من ${total} اختبارات.`, syntaxFirst: (where, message) => `أصلح خطأ الصياغة${where} أولًا: ${message}`,
      line: line => ` في السطر ${line}`, checksTimedOut: 'لم تنتهِ الاختبارات. ابحث عن حلقة لا تنتهي.', objectiveUnchecked: 'تعذّر فحص هذا الهدف.',
      syntaxError: (where, message) => `خطأ في الصياغة${where}: ${message}. نعرض آخر معاينة كانت تعمل.`, loopError: 'توقفت المعاينة عن الاستجابة. ابحث عن حلقة لا تنتهي.',
      startError: 'تعذّر بدء المعاينة. عدّل الكود للمحاولة مجددًا أو أعد تحميل الصفحة.', runtimeError: message => `خطأ أثناء التشغيل: ${message}`,
    },
    inspector: { title: 'فاحص الحالة', note: 'القيم التي يحتفظ بها React', noState: 'لا توجد حالة بعد. ستظهر المكوّنات هنا عندما تستدعي useState.', waiting: 'في انتظار المعاينة…' },
    handbook: {
      hero: 'حالة React / مرجع سريع', title: 'الدليل', sectionOne: '01 / الحالة بنظرة سريعة', component: 'المكوّن', state: 'الحالة', memoryTitle: 'الحالة هي ذاكرة',
      memoryBody: 'قيمة يحتفظ بها المكوّن بين عمليات العرض.', anatomy: 'تشريح useState', currentValue: 'القيمة الحالية', requestsUpdate: 'يطلب تحديثًا', startingValue: 'القيمة الابتدائية',
      sectionTwo: '02 / الاستخدام في مشاريع حقيقية', patternsTitle: 'ثلاثة أنماط يجدر تذكّرها', replaceTitle: 'استبدل الكائنات والمصفوفات — لا تعدّلها مباشرة',
      replaceRule: 'عامل الحالة كقيمة للقراءة فقط، ومرّر قيمة جديدة إلى دالة الضبط.', object: 'كائن', array: 'مصفوفة', dont: 'لا تفعل', do: 'افعل',
      previousTitle: 'عندما تعتمد الحالة التالية على السابقة', previousRule: 'مرّر دالة تحديث.', parentTitle: 'تحديث حالة الأب من مكوّن ابن',
      parentRule: 'القيمة إلى الأسفل، والاستدعاء العكسي إلى الأعلى، ومصدر حقيقة واحد.', parentState: 'حالة الأب', child: 'الابن', valueDown: 'القيمة ↓', callbackUp: 'الاستدعاء ↑',
      queuedValues: 'تتدرج القيم في الطابور من صفر إلى ثلاثة', parentFlow: 'يمرر الأب القيمة إلى الابن ويستدعي الابن دالة الرجوع',
      correctObject: 'تحديث صحيح للكائن', correctArray: 'تحديث صحيح للمصفوفة', codeExample: 'مثال كود', startLesson: 'ابدأ الدرس 1', back: 'العودة إلى الدورة', continueLabel: 'متابعة التعلّم',
    },
  },
}
