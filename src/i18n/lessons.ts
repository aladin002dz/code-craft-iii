import type { Lesson, Prediction } from '../lessons/types'
import type { Locale } from '../state/stores'

type LessonTranslation = Pick<Lesson, 'topic' | 'title' | 'project' | 'request' | 'steps' | 'concept' | 'objectives' | 'hints'> & {
  prediction?: Prediction
}

const fr: Record<number, LessonTranslation> = {
  1: {
    topic: 'L’état modifie l’écran', title: 'Faites fonctionner le thème', project: 'Panneau de réglages',
    request: 'Le panneau Apparence possède un bouton de thème, mais un clic ne fait rien. Faites-le basculer entre les modes clair et sombre.',
    steps: ['Cliquez sur le bouton dans l’aperçu et constatez que rien ne change.', 'Trouvez handleToggle. Cette fonction s’exécute à chaque clic mais ne met jamais l’état à jour.', 'Faites-lui enregistrer l’inverse de la valeur isDark actuelle.', 'Lancez les vérifications.'],
    concept: 'React mémorise isDark entre les rendus. Appeler setIsDark demande à React un nouveau rendu avec une nouvelle valeur ; ce rendu détermine le thème et le libellé du bouton. Les deux suivent la même valeur d’état.',
    objectives: [{ id: 'toggles-state', label: 'Chaque clic inverse isDark' }, { id: 'theme-follows-state', label: 'Le thème suit isDark' }, { id: 'label-follows-state', label: 'Le libellé du bouton suit isDark' }],
    hints: ['Le bouton appelle déjà handleToggle, mais cette fonction ne demande jamais à React de changer quoi que ce soit. Quelle fonction met isDark à jour ?', 'setIsDark est le setter de isDark. Appelez-le dans handleToggle avec la prochaine valeur de isDark.', 'Passez l’inverse de la valeur actuelle : setIsDark(!isDark);'],
  },
  2: {
    topic: 'useState et les setters', title: 'Ajoutez les contrôles de quantité', project: 'Panier',
    request: 'L’article affiche une quantité, mais les boutons + et − ne font rien. Donnez-lui une quantité réelle, mémorisée, qui commence à 1.',
    steps: ['Remplacez la variable de quantité ordinaire par un état initialisé à 1.', 'Faites en sorte que + ajoute un à la quantité.', 'Faites en sorte que − retire un sans jamais descendre sous 0.', 'Lancez les vérifications.'],
    concept: 'useState renvoie la valeur actuelle et un setter : const [quantity, setQuantity] = useState(1). Une variable ordinaire est oubliée au rendu suivant ; l’état est mémorisé. Appelez le setter pour demander un nouveau rendu avec la nouvelle valeur.',
    objectives: [{ id: 'starts-at-one', label: 'La quantité est un état qui commence à 1' }, { id: 'increase', label: '+ ajoute un' }, { id: 'decrease', label: '− retire un et s’arrête à 0' }],
    hints: ['Une variable const quantity = 1 reprend la même valeur à chaque rendu. Quel hook mémorise une valeur entre les rendus ?', 'useState(1) renvoie la valeur actuelle et la fonction qui la modifie. Déstructurez-les : const [quantity, setQuantity] = useState(1);', 'Dans increase, appelez setQuantity avec la nouvelle valeur. Dans decrease, ne le faites que si quantity est supérieur à 0.'],
  },
  3: {
    topic: 'Mises à jour et état précédent', title: 'Réparez l’action Ajouter 3', project: 'Panier',
    request: 'Ajouter 1 fonctionne, mais Ajouter 3 n’ajoute qu’un seul article. Faites-lui en ajouter exactement trois sans casser Ajouter 1.',
    steps: ['Répondez à la prédiction, puis essayez Ajouter 3 dans l’aperçu.', 'Regardez comment addThree réutilise addOne et quelle quantité chaque appel voit.', 'Modifiez la mise à jour pour que les appels d’un même clic s’appuient les uns sur les autres.', 'Lancez les vérifications.'],
    concept: 'Chaque rendu voit un instantané de l’état. Pendant un clic, quantity garde le même nombre à chaque lecture : trois appels setQuantity(quantity + 1) demandent donc tous « passer à 1 ». Avec setQuantity(previous => previous + 1), React transmet à chaque mise à jour le résultat de la précédente.',
    prediction: { question: 'Le panier affiche 0 article. Le client clique sur Ajouter 3. Que montre ensuite le panier ?', code: 'function addOne() {\n  setQuantity(quantity + 1);\n}\n\nfunction addThree() {\n  addOne();\n  addOne();\n  addOne();\n}', options: ['3', '1', '0'], answer: 1, explanation: 'Les trois appels ont lieu pendant le même clic : chacun lit quantity à 0 et demande « passer à 1 ». React traite la file dans l’ordre et termine à 1. Modifier l’état ne change pas la variable quantity au milieu du gestionnaire.' },
    objectives: [{ id: 'adds-three', label: 'Ajouter 3 ajoute exactement trois articles' }, { id: 'adds-one', label: 'Ajouter 1 ajoute toujours un article' }],
    hints: ['Ajouter 3 appelle addOne trois fois de suite. Quelle valeur de quantity chacun de ces appels voit-il ?', 'Un setter peut recevoir une fonction. React l’appelle avec la dernière valeur en attente : setQuantity(previous => ...).', 'Dans addOne, utilisez la valeur précédente : setQuantity(previous => previous + 1);'],
  },
  4: {
    topic: 'État ou props', title: 'Passez les bonnes props', project: 'Panier',
    request: 'Le panneau de commande connaît la quantité, mais l’article affiche toujours 0 et son bouton ne fait rien. Reliez-les.',
    steps: ['Trouvez quel composant possède l’état quantity et lequel se contente de l’afficher.', 'Passez le nom, la quantité et la fonction d’ajout du parent à CartItem.', 'Utilisez ces props dans CartItem à la place des valeurs codées en dur.', 'Lancez les vérifications.'],
    concept: 'L’état appartient à un seul composant : celui qui doit le modifier. Les enfants reçoivent les valeurs en props et des fonctions en props quand ils doivent demander une modification au parent. Une prop est en lecture seule pour l’enfant.',
    objectives: [{ id: 'shows-parent-value', label: 'CartItem affiche le nom et la quantité reçus' }, { id: 'button-updates-parent', label: 'Ajouter un demande au parent de mettre son état à jour' }, { id: 'parent-owns-state', label: 'Seul CartPanel stocke la quantité' }],
    hints: ['CartPanel rend <CartItem /> sans aucune prop. De quoi CartItem a-t-il besoin ?', 'Passez les valeurs comme attributs : <CartItem name="Desk lamp" quantity={quantity} onAdd={addOne} />. Lisez-les ensuite dans CartItem.', 'Dans CartItem, affichez {quantity} et utilisez onClick={onAdd}. N’ajoutez pas de useState : le parent possède déjà la quantité.'],
  },
  5: {
    topic: 'Une source de vérité', title: 'Synchronisez deux contrôles', project: 'Panneau de réglages',
    request: 'Le curseur et le champ numérique conservent chacun leur copie du volume, puis divergent. Faites en sorte qu’ils soient toujours d’accord.',
    steps: ['Déplacez le curseur et remarquez que le nombre ne change pas, puis essayez le champ numérique.', 'Comptez les valeurs que React stocke pour ce seul réglage.', 'Gardez une seule valeur volume et faites-la lire et modifier par les deux champs.', 'Lancez les vérifications.'],
    concept: 'Quand deux états décrivent le même fait, ils peuvent se contredire. Stockez ce fait une seule fois et faites utiliser cette valeur à chaque contrôle qui l’affiche ou la modifie. Les contrôles sont deux vues du même état.',
    objectives: [{ id: 'slider-updates-number', label: 'Déplacer le curseur met le champ numérique à jour' }, { id: 'number-updates-slider', label: 'Saisir un nombre déplace le curseur' }, { id: 'single-source', label: 'Le volume n’est stocké qu’une seule fois' }],
    hints: ['L’inspecteur montre deux valeurs d’état pour un seul réglage. Laquelle l’autre doit-elle suivre ?', 'Supprimez une ligne useState et renommez l’autre en volume. Les deux champs doivent utiliser value={volume}.', 'Les deux gestionnaires onChange doivent appeler le même setter : setVolume(Number(event.target.value)).'],
  },
  6: {
    topic: 'Objets et tableaux dans l’état', title: 'Mettez à jour une liste de tâches', project: 'Tableau de tâches',
    request: 'Le tableau affiche sa liste, mais Ajouter, Supprimer et le déplacement ne font encore rien. Terminez ces actions sans modifier le tableau existant.',
    steps: ['Ajouter : créez un nouveau tableau avec les anciennes tâches et la nouvelle.', 'Supprimer : créez un nouveau tableau sans la tâche qui possède cet id.', 'Déplacer : copiez le tableau, déplacez un élément dans la copie, puis définissez-la comme nouvel état.', 'Faites glisser une tâche par sa poignée ou utilisez les flèches, puis lancez les vérifications.'],
    concept: 'Ne modifiez jamais directement un tableau ou un objet d’état. React compare la nouvelle valeur à l’ancienne pour décider d’un nouveau rendu : fournissez-lui un nouveau tableau avec [...tasks, task], tasks.filter(...) ou une copie réordonnée. Les vérifications figent l’état afin qu’une mutation directe échoue clairement.',
    objectives: [{ id: 'adds-task', label: 'Ajouter place une tâche à la fin et vide le champ' }, { id: 'removes-task', label: '× supprime uniquement cette tâche' }, { id: 'reorders-tasks', label: 'Les flèches réordonnent la liste sans perdre de tâche' }],
    hints: ['push, splice et l’affectation par index modifient le tableau déjà détenu par React. Comment créer un nouveau tableau ?', 'Pour ajouter et supprimer : setTasks([...tasks, newTask]) et setTasks(tasks.filter(task => task.id !== id)).', 'Pour déplacer : const next = [...tasks]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); setTasks(next);'],
  },
  7: {
    topic: 'Remonter l’état', title: 'Partagez le texte de recherche', project: 'Tableau de tâches',
    request: 'La saisie dans la recherche doit filtrer les tâches, mais les deux composants sont frères et la liste ignore ce qui a été saisi.',
    steps: ['Trouvez où vit le texte de recherche et qui d’autre en a besoin.', 'Déplacez l’état dans SearchBoard, le parent commun le plus proche.', 'Passez le texte et un moyen de le modifier à SearchBox, puis le texte à TaskList.', 'Filtrez les tâches sans tenir compte des majuscules, puis lancez les vérifications.'],
    concept: 'Des composants frères ne peuvent pas lire leurs états respectifs. Quand deux composants ont besoin de la même valeur, remontez-la dans leur parent commun le plus proche, puis transmettez la valeur et le setter en props. Le parent devient l’unique propriétaire.',
    objectives: [{ id: 'filters-list', label: 'La saisie filtre la liste sans tenir compte des majuscules' }, { id: 'clearing-restores', label: 'Effacer la recherche réaffiche toutes les tâches' }, { id: 'parent-owns-query', label: 'Le texte de recherche vit dans SearchBoard, pas SearchBox' }],
    hints: ['SearchBox possède query, mais TaskList ne la voit jamais. Quel composant rend les deux ?', 'Déplacez const [query, setQuery] = useState(\'\') dans SearchBoard, puis passez query et setQuery à SearchBox.', 'Donnez une prop query à TaskList et filtrez avec allTasks.filter(task => task.toLowerCase().includes(query.toLowerCase())).'],
  },
  8: {
    topic: 'État dérivé', title: 'Calculez le sous-total', project: 'Panier',
    request: 'Le sous-total reste bloqué à 50 $ quand la quantité change. Corrigez-le sans devoir synchroniser deux valeurs.',
    steps: ['Cliquez sur Ajouter un et observez le désaccord entre quantité et sous-total.', 'Demandez-vous si le sous-total peut être calculé à partir d’une valeur déjà stockée par React.', 'Calculez-le pendant le rendu au lieu de le stocker.', 'Lancez les vérifications.'],
    concept: 'Si une valeur peut être calculée depuis l’état et les props existants, calculez-la pendant le rendu au lieu de la stocker. Une copie stockée peut devenir obsolète. Ici, subtotal vaut toujours quantity × unitPrice : seule quantity est un état.',
    objectives: [{ id: 'initial-subtotal', label: 'Deux lampes à 25 $ donnent un sous-total de 50 $' }, { id: 'follows-quantity', label: 'Le sous-total suit la quantité' }, { id: 'no-duplicate-state', label: 'Seule la quantité est stockée' }],
    hints: ['Il existe deux états, mais le sous-total est entièrement déterminé par la quantité. Et s’il ne s’agissait pas d’un état ?', 'Supprimez l’état subtotal et son setter. Dans le composant, créez une variable ordinaire qui le calcule.', 'const subtotal = quantity * unitPrice; se place avant return, et addOne ne met à jour que quantity.'],
  },
  9: {
    topic: 'Réinitialiser ou préserver l’état', title: 'Préservez ou réinitialisez volontairement', project: 'Tableau de tâches',
    request: 'Deux problèmes se produisent : après avoir modifié une tâche puis inversé les lignes, le texte suit la mauvaise tâche. Et passer d’Ada à Grace conserve le commentaire d’Ada.',
    steps: ['Modifiez Task A, cliquez sur Swap order et observez où va le texte.', 'Saisissez un commentaire pour Ada, puis passez à Grace.', 'Donnez à chaque ligne une key qui identifie la tâche, pas sa position.', 'Donnez au formulaire une key qui change avec la personne, puis lancez les vérifications.'],
    concept: 'React associe l’état d’un composant à sa place dans l’arbre, définie par son type et sa key. Une key stable (l’id de la tâche) conserve l’état avec le même élément lors d’un réordonnancement. Changer volontairement la key (l’id de la personne) force un nouveau composant et un état neuf.',
    objectives: [{ id: 'swap-reorders', label: 'Swap order place Task B en premier' }, { id: 'rows-keep-edits', label: 'Une tâche modifiée garde son texte après l’inversion' }, { id: 'reset-on-person-change', label: 'Changer de personne crée un formulaire de commentaire neuf' }],
    hints: ['Les lignes utilisent key={index}. Après l’inversion, quelle ligne React considère-t-il comme identique ?', 'Utilisez l’id de la tâche : key={task.id}. L’état suit alors la tâche pendant le réordonnancement.', 'Pour réinitialiser volontairement : <CommentForm key={person.id} person={person} /> crée un formulaire neuf quand la personne change.'],
  },
}

const ar: Record<number, LessonTranslation> = {
  1: {
    topic: 'الحالة تغيّر الشاشة', title: 'شغّل زر تبديل السمة', project: 'لوحة الإعدادات',
    request: 'تحتوي لوحة المظهر على زر للسمة، لكن النقر عليه لا يفعل شيئًا. اجعله يبدّل بين الوضعين الفاتح والداكن.',
    steps: ['انقر الزر في المعاينة ولاحظ أن شيئًا لا يتغيّر.', 'ابحث عن handleToggle. تعمل مع كل نقرة لكنها لا تحدّث الحالة.', 'اجعلها تخزّن عكس قيمة isDark الحالية.', 'شغّل الاختبارات.'],
    concept: 'يتذكّر React قيمة isDark بين عمليات العرض. يستدعي setIsDark عرضًا جديدًا بقيمة جديدة، ويحدّد ذلك العرض السمة ونص الزر. كلاهما يتبع قيمة الحالة نفسها.',
    objectives: [{ id: 'toggles-state', label: 'كل نقرة تعكس isDark' }, { id: 'theme-follows-state', label: 'السمة تتبع isDark' }, { id: 'label-follows-state', label: 'نص الزر يتبع isDark' }],
    hints: ['يستدعي الزر handleToggle بالفعل، لكنها لا تطلب من React تغيير شيء. ما الدالة المسؤولة عن تحديث isDark؟', 'setIsDark هي دالة ضبط isDark. استدعها داخل handleToggle ومرّر قيمة isDark التالية.', 'مرّر عكس القيمة الحالية: setIsDark(!isDark);'],
  },
  2: {
    topic: 'useState ودوال الضبط', title: 'أضف عناصر التحكم بالكمية', project: 'سلة التسوق',
    request: 'يعرض عنصر السلة كمية، لكن زري + و− لا يعملان. اجعل له كمية حقيقية محفوظة تبدأ من 1.',
    steps: ['استبدل متغيّر الكمية العادي بحالة تبدأ من 1.', 'اجعل + يزيد الكمية واحدًا.', 'اجعل − ينقص واحدًا دون النزول تحت 0.', 'شغّل الاختبارات.'],
    concept: 'تعيد useState القيمة الحالية ودالة ضبط: const [quantity, setQuantity] = useState(1). يُنسى المتغيّر العادي في العرض التالي، أما الحالة فتُحفظ. استدعِ دالة الضبط لطلب عرض جديد بالقيمة الجديدة.',
    objectives: [{ id: 'starts-at-one', label: 'الكمية حالة تبدأ من 1' }, { id: 'increase', label: '+ يضيف واحدًا' }, { id: 'decrease', label: '− ينقص واحدًا ويتوقف عند 0' }],
    hints: ['يعود المتغيّر const quantity = 1 إلى القيمة نفسها في كل عرض. أي hook يتذكّر القيمة بين عمليات العرض؟', 'تعطيك useState(1) القيمة الحالية والدالة التي تغيّرها. فكّكهما: const [quantity, setQuantity] = useState(1);', 'داخل increase استدعِ setQuantity بالقيمة الجديدة. وداخل decrease لا تفعل ذلك إلا إذا كانت quantity أكبر من 0.'],
  },
  3: {
    topic: 'التحديثات والحالة السابقة', title: 'أصلح إجراء إضافة 3', project: 'سلة التسوق',
    request: 'تعمل إضافة 1، لكن إضافة 3 تضيف عنصرًا واحدًا فقط. اجعلها تضيف ثلاثة بالضبط دون تعطيل إضافة 1.',
    steps: ['أجب عن التوقّع، ثم جرّب إضافة 3 في المعاينة.', 'لاحظ كيف تعيد addThree استخدام addOne وأي قيمة quantity يراها كل استدعاء.', 'غيّر طريقة كتابة التحديث كي يبني كل استدعاء في النقرة نفسها على سابقه.', 'شغّل الاختبارات.'],
    concept: 'ترى كل عملية عرض لقطة واحدة للحالة. أثناء نقرة واحدة تبقى quantity القيمة نفسها عند كل قراءة، لذا تطلب ثلاثة استدعاءات setQuantity(quantity + 1) كلها «اضبطها على 1». عند تمرير setQuantity(previous => previous + 1)، يزوّد React كل تحديث بنتيجة سابقه.',
    prediction: { question: 'تعرض السلة 0 عناصر. نقر المستخدم إضافة 3. ماذا ستعرض بعدها؟', code: 'function addOne() {\n  setQuantity(quantity + 1);\n}\n\nfunction addThree() {\n  addOne();\n  addOne();\n  addOne();\n}', options: ['3', '1', '0'], answer: 1, explanation: 'تعمل الاستدعاءات الثلاثة أثناء النقرة نفسها، فيقرأ كل منها quantity بقيمة 0 ويطلب «اضبطها على 1». يطبّق React الطابور بالترتيب وينتهي عند 1. لا يغيّر ضبط الحالة متغيّر quantity في منتصف المعالج.' },
    objectives: [{ id: 'adds-three', label: 'إضافة 3 تضيف ثلاثة بالضبط' }, { id: 'adds-one', label: 'إضافة 1 لا تزال تضيف واحدًا' }],
    hints: ['تستدعي إضافة 3 الدالة addOne ثلاث مرات متتالية. ما قيمة quantity التي يراها كل استدعاء؟', 'يمكن لدالة الضبط استقبال دالة. يستدعيها React بأحدث قيمة في الطابور: setQuantity(previous => ...).', 'استخدم القيمة السابقة داخل addOne: setQuantity(previous => previous + 1);'],
  },
  4: {
    topic: 'الحالة أم الخصائص', title: 'مرّر الخصائص الصحيحة', project: 'سلة التسوق',
    request: 'تعرف لوحة الطلب الكمية، لكن عنصر السلة يعرض 0 دائمًا وزره لا يعمل. صِل بينهما.',
    steps: ['حدّد المكوّن الذي يملك حالة quantity والمكوّن الذي يعرضها فقط.', 'مرّر الاسم والكمية ودالة الإضافة من الأب إلى CartItem.', 'استخدم هذه الخصائص داخل CartItem بدل القيم الثابتة.', 'شغّل الاختبارات.'],
    concept: 'تخص الحالة مكوّنًا واحدًا: المكوّن الذي يحتاج إلى تغييرها. يستقبل الأبناء القيم كخصائص، ويستقبلون الدوال كخصائص حين يحتاجون إلى طلب تغيير من الأب. الخاصية للقراءة فقط لدى الابن.',
    objectives: [{ id: 'shows-parent-value', label: 'يعرض CartItem الاسم والكمية اللذين يستقبلهما' }, { id: 'button-updates-parent', label: 'يطلب زر الإضافة من الأب تحديث حالته' }, { id: 'parent-owns-state', label: 'يخزّن CartPanel وحده الكمية' }],
    hints: ['يعرض CartPanel العنصر <CartItem /> بلا خصائص، لذلك ليس لدى CartItem ما يعرضه. ماذا يحتاج من الأب؟', 'مرّر القيم كسمات: <CartItem name="Desk lamp" quantity={quantity} onAdd={addOne} />، ثم اقرأها داخل CartItem.', 'اعرض {quantity} داخل CartItem واجعل الزر onClick={onAdd}. لا تضف useState جديدة؛ فالأب يملك الكمية.'],
  },
  5: {
    topic: 'مصدر حقيقة واحد', title: 'زامن عنصري تحكم', project: 'لوحة الإعدادات',
    request: 'يحتفظ شريط الصوت وحقل الرقم كلٌ بنسخته من الصوت، فتختلفان. اجعلهما متطابقين دائمًا.',
    steps: ['حرّك الشريط ولاحظ ثبات الرقم، ثم جرّب حقل الرقم.', 'احسب عدد القيم التي يخزّنها React لإعداد واحد.', 'احتفظ بقيمة volume واحدة واجعل كلا الحقلين يقرآنها ويحدّثانها.', 'شغّل الاختبارات.'],
    concept: 'عندما تصف حالتان الحقيقة نفسها يمكن أن تختلفا. خزّن الحقيقة مرة واحدة، واجعل كل عنصر يعرضها أو يعدّلها يستخدم تلك القيمة. عنصرا التحكم مجرد عرضين للحالة نفسها.',
    objectives: [{ id: 'slider-updates-number', label: 'تحريك الشريط يحدّث حقل الرقم' }, { id: 'number-updates-slider', label: 'كتابة رقم تحرّك الشريط' }, { id: 'single-source', label: 'يُخزّن الصوت مرة واحدة فقط' }],
    hints: ['يعرض الفاحص قيمتي حالة لإعداد واحد. أيهما يجب أن تتبعه الأخرى؟', 'احذف أحد سطري useState وسمّ الآخر volume. يجب أن يستخدم الحقلان value={volume}.', 'يجب أن يستدعي معالجا onChange دالة الضبط نفسها: setVolume(Number(event.target.value)).'],
  },
  6: {
    topic: 'الكائنات والمصفوفات في الحالة', title: 'حدّث قائمة مهام', project: 'لوحة المهام',
    request: 'تعرض لوحة المهام قائمتها، لكن الإضافة والحذف وإعادة الترتيب لا تعمل بعد. أكمل الإجراءات الثلاثة دون تغيير المصفوفة الحالية.',
    steps: ['الإضافة: أنشئ مصفوفة جديدة تضم المهام القديمة والجديدة.', 'الحذف: أنشئ مصفوفة جديدة من دون المهمة ذات هذا المعرّف.', 'النقل: انسخ المصفوفة وانقل عنصرًا في النسخة ثم اضبطها كحالة جديدة.', 'اسحب مهمة من المقبض أو استخدم الأسهم، ثم شغّل الاختبارات.'],
    concept: 'لا تغيّر مصفوفة أو كائن الحالة مباشرة. يقارن React القيمة الجديدة بالقديمة ليقرر إعادة العرض، لذلك أعطه مصفوفة جديدة مثل [...tasks, task] أو tasks.filter(...) أو نسخة تعيد ترتيبها. تجمّد الاختبارات الحالة كي يفشل التغيير المباشر بوضوح.',
    objectives: [{ id: 'adds-task', label: 'تضع الإضافة مهمة جديدة في النهاية وتفرغ الحقل' }, { id: 'removes-task', label: 'يحذف × تلك المهمة فقط' }, { id: 'reorders-tasks', label: 'تعيد أزرار النقل ترتيب القائمة دون فقد مهمة' }],
    hints: ['تغيّر push وsplice والتعيين بالفهرس المصفوفة التي يحتفظ بها React. ما الذي ينشئ مصفوفة جديدة؟', 'للإضافة والحذف: setTasks([...tasks, newTask]) وsetTasks(tasks.filter(task => task.id !== id)).', 'للنقل: const next = [...tasks]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); setTasks(next);'],
  },
  7: {
    topic: 'رفع الحالة إلى الأعلى', title: 'شارك نص البحث', project: 'لوحة المهام',
    request: 'يجب أن ترشّح الكتابة في البحث قائمة المهام، لكن المكوّنين شقيقان والقائمة لا تعرف ما كُتب.',
    steps: ['ابحث عن مكان نص البحث الآن ومن يحتاج إليه أيضًا.', 'انقل الحالة إلى SearchBoard، أقرب أب مشترك للمكوّنين.', 'مرّر النص وطريقة تغييره إلى SearchBox، ومرّر النص إلى TaskList.', 'رشّح المهام متجاهلًا حالة الأحرف، ثم شغّل الاختبارات.'],
    concept: 'لا يستطيع المكوّنان الشقيقان قراءة حالة أحدهما الآخر. عندما يحتاج مكوّنان إلى القيمة نفسها، ارفعها إلى أقرب أب مشترك، ثم مرّر القيمة ودالة الضبط إلى الأسفل كخصائص. يصبح الأب المالك الوحيد.',
    objectives: [{ id: 'filters-list', label: 'ترشّح الكتابة القائمة دون اعتبار حالة الأحرف' }, { id: 'clearing-restores', label: 'مسح البحث يعيد كل المهام' }, { id: 'parent-owns-query', label: 'يعيش نص البحث في SearchBoard لا SearchBox' }],
    hints: ['يملك SearchBox القيمة query لكن TaskList لا يراها. أي مكوّن يعرضهما معًا؟', 'انقل const [query, setQuery] = useState(\'\') إلى SearchBoard، ثم مرّر query وsetQuery إلى SearchBox.', 'أعط TaskList الخاصية query ورشّح باستخدام allTasks.filter(task => task.toLowerCase().includes(query.toLowerCase())).'],
  },
  8: {
    topic: 'الحالة المشتقة', title: 'احسب المجموع الفرعي', project: 'سلة التسوق',
    request: 'يبقى المجموع الفرعي 50$ عندما تتغيّر الكمية. أصلحه دون مزامنة قيمتين.',
    steps: ['انقر إضافة واحد وراقب اختلاف الكمية والمجموع.', 'اسأل: هل يمكن حساب المجموع من شيء يخزّنه React بالفعل؟', 'احسبه أثناء العرض بدل تخزينه.', 'شغّل الاختبارات.'],
    concept: 'إذا أمكن حساب قيمة من الحالة والخصائص الموجودة، فاحسبها أثناء العرض بدل تخزينها. يجب تحديث النسخ المخزنة في كل مكان وقد تصبح قديمة. هنا subtotal يساوي دائمًا quantity × unitPrice، لذا quantity هي الحالة الوحيدة.',
    objectives: [{ id: 'initial-subtotal', label: 'مصباحان بسعر 25$ يعرضان مجموعًا 50$' }, { id: 'follows-quantity', label: 'المجموع الفرعي يتبع الكمية' }, { id: 'no-duplicate-state', label: 'تُخزّن الكمية وحدها' }],
    hints: ['هناك قيمتا حالة، لكن الكمية تحدد المجموع بالكامل. ماذا لو لم يكن المجموع حالة أصلًا؟', 'احذف حالة subtotal ودالة ضبطها. اكتب متغيّرًا عاديًا يحسبها في جسم المكوّن.', 'ضع const subtotal = quantity * unitPrice; قبل return، ولا تحتاج addOne إلا إلى تحديث quantity.'],
  },
  9: {
    topic: 'إعادة ضبط الحالة والحفاظ عليها', title: 'حافظ على الحالة أو أعد ضبطها بقصد', project: 'لوحة المهام',
    request: 'يوجد خطآن: بعد تعديل مهمة ثم تبديل الصفوف ينتقل النص إلى المهمة الخطأ. كما أن الانتقال من Ada إلى Grace يحتفظ بتعليق Ada.',
    steps: ['عدّل Task A وانقر Swap order ولاحظ مكان التعديل.', 'اكتب تعليقًا لـ Ada ثم انتقل إلى Grace.', 'أعط كل صف key تعرّف المهمة نفسها لا موضعها.', 'أعط نموذج التعليق key تتغيّر بتغيّر الشخص، ثم شغّل الاختبارات.'],
    concept: 'يربط React حالة المكوّن بمكانه في الشجرة وفق النوع وkey. تحافظ key ثابتة (معرّف المهمة) على الحالة مع العنصر نفسه عند إعادة الترتيب. يؤدي تغيير key بقصد (معرّف الشخص) إلى التخلص من النسخة القديمة والبدء بحالة جديدة.',
    objectives: [{ id: 'swap-reorders', label: 'يضع Swap order المهمة Task B أولًا' }, { id: 'rows-keep-edits', label: 'تحتفظ المهمة المعدّلة بنصها بعد التبديل' }, { id: 'reset-on-person-change', label: 'يبدأ تغيير الشخص بنموذج تعليق جديد' }],
    hints: ['تستخدم الصفوف key={index}. بعد التبديل، أي صف يظن React أنه أي مهمة؟', 'استخدم معرّف المهمة: key={task.id}. عندها تتبع الحالة المهمة أثناء إعادة الترتيب.', 'لإعادة الضبط بقصد استخدم: <CommentForm key={person.id} person={person} /> كي يبدأ React نموذجًا جديدًا عند تغيّر الشخص.'],
  },
}

export function localizeLesson(lesson: Lesson, locale: Locale): Lesson {
  if (locale === 'en') return lesson
  const translation = (locale === 'fr' ? fr : ar)[lesson.id]
  return { ...lesson, ...translation, prediction: translation.prediction ?? lesson.prediction }
}

export function localizeLessons(lessons: Lesson[], locale: Locale): Lesson[] {
  return lessons.map(lesson => localizeLesson(lesson, locale))
}
