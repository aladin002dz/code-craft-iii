import type { Locale } from '../state/stores'

const fr: Record<string, string> = {
  '1:toggles-state': 'Le clic ne change pas correctement isDark. Appelez setIsDark dans handleToggle avec l’inverse de la valeur actuelle.',
  '1:theme-follows-state': 'Le thème ne suit pas isDark. Utilisez isDark pour choisir la classe du panneau.',
  '1:label-follows-state': 'Le libellé du bouton ne suit pas isDark. Utilisez cette valeur pour proposer le mode opposé.',
  '2:starts-at-one': 'La quantité doit être un état initialisé à 1 avec useState(1).',
  '2:increase': 'Le bouton + doit appeler setQuantity et ajouter exactement un à chaque clic.',
  '2:decrease': 'Le bouton − doit retirer un sans laisser la quantité descendre sous 0.',
  '3:adds-three': 'Ajouter 3 doit construire chaque mise à jour sur la précédente. Utilisez une fonction de mise à jour dans setQuantity.',
  '3:adds-one': 'Ajouter 1 doit encore ajouter exactement un article.',
  '4:shows-parent-value': 'CartItem doit afficher le nom et la quantité reçus de CartPanel en props.',
  '4:button-updates-parent': 'Passez addOne en prop et appelez-la depuis le bouton de CartItem.',
  '4:parent-owns-state': 'Gardez une seule quantité dans l’état de CartPanel ; CartItem doit la recevoir en prop.',
  '5:slider-updates-number': 'Le curseur et le champ numérique doivent lire la même valeur d’état.',
  '5:number-updates-slider': 'Le champ numérique et le curseur doivent appeler le même setter.',
  '5:single-source': 'React ne doit stocker qu’une seule valeur volume pour les deux contrôles.',
  '6:adds-task': 'Créez un nouveau tableau contenant les anciennes tâches et la nouvelle, puis videz le champ.',
  '6:removes-task': 'Créez un nouveau tableau qui exclut uniquement la tâche correspondant à cet id.',
  '6:reorders-tasks': 'Réordonnez une copie du tableau et conservez toutes les tâches.',
  '7:filters-list': 'Placez le texte de recherche dans SearchBoard et transmettez-le à TaskList pour filtrer sans tenir compte des majuscules.',
  '7:clearing-restores': 'Une recherche vide doit réafficher toutes les tâches.',
  '7:parent-owns-query': 'SearchBoard, le parent commun, doit posséder l’état de recherche.',
  '8:initial-subtotal': 'Le sous-total initial doit être quantity × unitPrice, soit 50 $.',
  '8:follows-quantity': 'Calculez le sous-total pendant chaque rendu pour qu’il suive la quantité.',
  '8:no-duplicate-state': 'Ne stockez que la quantité ; le sous-total doit être une valeur calculée.',
  '9:swap-reorders': 'Le bouton Swap order doit placer Task B avant Task A.',
  '9:rows-keep-edits': 'Utilisez task.id comme key afin que le texte modifié reste associé à la bonne tâche.',
  '9:reset-on-person-change': 'Utilisez person.id comme key de CommentForm pour obtenir un formulaire neuf quand la personne change.',
}

const ar: Record<string, string> = {
  '1:toggles-state': 'لا تغيّر النقرة isDark بشكل صحيح. استدعِ setIsDark داخل handleToggle مع عكس القيمة الحالية.',
  '1:theme-follows-state': 'لا تتبع السمة isDark. استخدم isDark لاختيار فئة اللوحة.',
  '1:label-follows-state': 'لا يتبع نص الزر isDark. استخدم القيمة لاقتراح الوضع المعاكس.',
  '2:starts-at-one': 'يجب أن تكون الكمية حالة تبدأ من 1 باستخدام useState(1).',
  '2:increase': 'يجب أن يستدعي زر + الدالة setQuantity ويضيف واحدًا بالضبط مع كل نقرة.',
  '2:decrease': 'يجب أن ينقص زر − واحدًا دون السماح للكمية بالنزول تحت 0.',
  '3:adds-three': 'يجب أن يبني إجراء إضافة 3 كل تحديث على سابقه. استخدم دالة تحديث داخل setQuantity.',
  '3:adds-one': 'يجب أن تستمر إضافة 1 في إضافة عنصر واحد بالضبط.',
  '4:shows-parent-value': 'يجب أن يعرض CartItem الاسم والكمية اللذين يستقبلهما من CartPanel كخصائص.',
  '4:button-updates-parent': 'مرّر addOne كخاصية واستدعها من زر CartItem.',
  '4:parent-owns-state': 'احتفظ بكمية واحدة في حالة CartPanel، وليستقبلها CartItem كخاصية.',
  '5:slider-updates-number': 'يجب أن يقرأ شريط الصوت وحقل الرقم قيمة الحالة نفسها.',
  '5:number-updates-slider': 'يجب أن يستدعي حقل الرقم والشريط دالة الضبط نفسها.',
  '5:single-source': 'يجب أن يخزّن React قيمة volume واحدة فقط لعنصري التحكم.',
  '6:adds-task': 'أنشئ مصفوفة جديدة تضم المهام القديمة والجديدة، ثم أفرغ الحقل.',
  '6:removes-task': 'أنشئ مصفوفة جديدة تستبعد المهمة التي تحمل هذا المعرّف فقط.',
  '6:reorders-tasks': 'أعد ترتيب نسخة من المصفوفة مع الاحتفاظ بكل المهام.',
  '7:filters-list': 'ضع نص البحث في SearchBoard ومرّره إلى TaskList للترشيح دون اعتبار حالة الأحرف.',
  '7:clearing-restores': 'يجب أن يعرض البحث الفارغ كل المهام مجددًا.',
  '7:parent-owns-query': 'يجب أن يملك SearchBoard، الأب المشترك، حالة البحث.',
  '8:initial-subtotal': 'يجب أن يكون المجموع الأولي quantity × unitPrice، أي 50$.',
  '8:follows-quantity': 'احسب المجموع أثناء كل عرض كي يتبع الكمية.',
  '8:no-duplicate-state': 'خزّن الكمية وحدها، واجعل المجموع قيمة محسوبة.',
  '9:swap-reorders': 'يجب أن يضع زر Swap order المهمة Task B قبل Task A.',
  '9:rows-keep-edits': 'استخدم task.id كقيمة key كي يبقى النص المعدّل مرتبطًا بالمهمة الصحيحة.',
  '9:reset-on-person-change': 'استخدم person.id كقيمة key لـ CommentForm لبدء نموذج جديد عند تغيّر الشخص.',
}

export function localizeCheckMessage(locale: Locale, lessonId: number, objectiveId: string, english: string | null): string | null {
  if (!english || locale === 'en') return english
  return (locale === 'fr' ? fr : ar)[`${lessonId}:${objectiveId}`] ?? english
}
