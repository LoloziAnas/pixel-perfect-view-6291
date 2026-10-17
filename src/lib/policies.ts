import type { Lang } from "@/lib/lang";

// Shop policies shown on /aide. In Arabic strings, \u2066…\u2069 keep numbers like "31-08" in reading order.
// Based on common practice for cash-on-delivery shops in
// Morocco and consumer law 31-08 (7-day return right for distance sales). Edit freely.

type Section = { id: string; title: string; items: string[] };
type Faq = { q: string; a: string };
type Policies = {
  title: string;
  intro: string;
  sections: Section[];
  faqTitle: string;
  faq: Faq[];
  contactTitle: string;
  contactText: string;
  contactCta: string;
};

export const policies: Record<Lang, Policies> = {
  fr: {
    title: "Aide & conditions",
    intro: "Tout ce qu'il faut savoir sur la livraison, le paiement et les échanges chez NOAUMA.",
    sections: [
      {
        id: "livraison",
        title: "Livraison",
        items: [
          "Livraison gratuite partout au Maroc, sans minimum d'achat.",
          "Après votre commande, nous vous appelons ou vous écrivons sur WhatsApp pour la confirmer avant l'expédition.",
          "Délais indicatifs après confirmation : 24 à 48 h à Kenitra, Rabat et Casablanca ; 2 à 5 jours ouvrables pour les autres villes.",
          "Le livreur vous appelle avant de passer : restez joignable au numéro indiqué dans la commande.",
        ],
      },
      {
        id: "paiement",
        title: "Paiement",
        items: [
          "Paiement en espèces à la livraison : vous ne payez rien en ligne.",
          "Vous pouvez ouvrir et vérifier votre colis devant le livreur avant de payer.",
          "Si l'article ne correspond pas à votre commande, vous pouvez le refuser sans frais.",
        ],
      },
      {
        id: "retours",
        title: "Échanges & retours",
        items: [
          "Vous disposez de 7 jours après la réception pour demander un échange ou un retour, conformément à la loi 31-08 sur la protection du consommateur.",
          "L'article doit être non utilisé, non lavé et rendu dans son emballage d'origine.",
          "Les frais de retour sont à votre charge, sauf si l'article est défectueux ou s'il y a une erreur de notre part : l'échange est alors entièrement gratuit.",
          "Après réception et vérification de l'article, nous expédions l'échange ou effectuons le remboursement sous 15 jours au maximum.",
          "Pour faire une demande, envoyez-nous votre nom et une photo de l'article sur WhatsApp.",
        ],
      },
      {
        id: "donnees",
        title: "Données personnelles",
        items: [
          "Votre nom, votre téléphone et votre adresse servent uniquement à traiter et livrer votre commande. Ils ne sont ni vendus ni partagés, sauf avec le livreur.",
          "Conformément à la loi 09-08, vous pouvez demander l'accès, la rectification ou la suppression de vos données en nous écrivant.",
        ],
      },
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Combien de temps prend la livraison ?",
        a: "24 à 48 h à Kenitra, Rabat et Casablanca, et 2 à 5 jours ouvrables dans les autres villes, à partir de la confirmation de votre commande.",
      },
      {
        q: "La livraison est-elle vraiment gratuite ?",
        a: "Oui, partout au Maroc et sans minimum d'achat.",
      },
      {
        q: "Puis-je vérifier le colis avant de payer ?",
        a: "Oui. Ouvrez le colis devant le livreur, vérifiez l'article, puis payez en espèces.",
      },
      {
        q: "Comment échanger ou retourner un article ?",
        a: "Écrivez-nous sur WhatsApp dans les 7 jours suivant la réception, avec une photo de l'article. Il doit être non utilisé et dans son emballage d'origine.",
      },
      {
        q: "Comment entretenir mon linge ?",
        a: "Lavage délicat à 30 °C et séchage à l'air libre. Évitez le sèche-linge et l'eau de Javel pour préserver la douceur et les couleurs.",
      },
      {
        q: "Puis-je modifier ou annuler ma commande ?",
        a: "Oui, tant qu'elle n'est pas expédiée : contactez-nous sur WhatsApp ou au +212 6 74 42 73 40.",
      },
      {
        q: "Puis-je commander plusieurs articles ?",
        a: "Oui, ajoutez-les au panier : ils sont livrés ensemble, toujours gratuitement.",
      },
    ],
    contactTitle: "Une autre question ?",
    contactText: "Écrivez-nous sur WhatsApp, nous vous répondons rapidement.",
    contactCta: "Nous écrire sur WhatsApp",
  },
  ar: {
    title: "المساعدة والشروط",
    intro: "كل ما تحتاجين معرفته عن التوصيل والدفع والاستبدال لدى نعومة.",
    sections: [
      {
        id: "livraison",
        title: "التوصيل",
        items: [
          "التوصيل مجاني لجميع أنحاء المغرب، بدون حد أدنى للشراء.",
          "بعد طلبك، نتصل بك أو نراسلك عبر واتساب لتأكيده قبل الشحن.",
          "المدة التقريبية بعد التأكيد: من 24 إلى 48 ساعة في القنيطرة والرباط والدار البيضاء، ومن 2 إلى 5 أيام عمل في باقي المدن.",
          "يتصل بك عامل التوصيل قبل الوصول: المرجو البقاء متاحة على الرقم المذكور في الطلب.",
        ],
      },
      {
        id: "paiement",
        title: "الدفع",
        items: [
          "الدفع نقداً عند الاستلام: لا تدفعين أي شيء عبر الإنترنت.",
          "يمكنك فتح الطرد والتحقق منه أمام عامل التوصيل قبل الدفع.",
          "إذا كان المنتج لا يطابق طلبك، يمكنك رفضه بدون أي مصاريف.",
        ],
      },
      {
        id: "retours",
        title: "الاستبدال والإرجاع",
        items: [
          "لديك 7 أيام بعد الاستلام لطلب الاستبدال أو الإرجاع، طبقاً للقانون \u206631-08\u2069 المتعلق بحماية المستهلك.",
          "يجب أن يكون المنتج غير مستعمل وغير مغسول، وفي تغليفه الأصلي.",
          "مصاريف الإرجاع على حسابك، إلا إذا كان المنتج معيباً أو كان الخطأ من جهتنا: يكون الاستبدال حينها مجانياً بالكامل.",
          "بعد استلام المنتج والتحقق منه، نرسل البديل أو نرجع المبلغ في أجل أقصاه 15 يوماً.",
          "لتقديم طلب، أرسلي لنا اسمك وصورة للمنتج عبر واتساب.",
        ],
      },
      {
        id: "donnees",
        title: "المعطيات الشخصية",
        items: [
          "يُستعمل اسمك ورقم هاتفك وعنوانك فقط لمعالجة طلبك وتوصيله. لا نبيعها ولا نشاركها، إلا مع عامل التوصيل.",
          "طبقاً للقانون \u206609-08\u2069، يمكنك طلب الاطلاع على معطياتك أو تصحيحها أو حذفها بمراسلتنا.",
        ],
      },
    ],
    faqTitle: "الأسئلة الشائعة",
    faq: [
      {
        q: "كم تستغرق مدة التوصيل؟",
        a: "من 24 إلى 48 ساعة في القنيطرة والرباط والدار البيضاء، ومن 2 إلى 5 أيام عمل في باقي المدن، ابتداءً من تأكيد طلبك.",
      },
      {
        q: "هل التوصيل مجاني فعلاً؟",
        a: "نعم، لجميع أنحاء المغرب وبدون حد أدنى للشراء.",
      },
      {
        q: "هل يمكنني التحقق من الطرد قبل الدفع؟",
        a: "نعم. افتحي الطرد أمام عامل التوصيل، تحققي من المنتج، ثم ادفعي نقداً.",
      },
      {
        q: "كيف أستبدل أو أرجع منتجاً؟",
        a: "راسلينا عبر واتساب خلال 7 أيام من الاستلام مع صورة للمنتج. يجب أن يكون غير مستعمل وفي تغليفه الأصلي.",
      },
      {
        q: "كيف أعتني بالمفروشات؟",
        a: "غسيل لطيف على 30 درجة وتجفيف في الهواء الطلق. تجنبي آلة التجفيف وماء جافيل للحفاظ على النعومة والألوان.",
      },
      {
        q: "هل يمكنني تعديل طلبي أو إلغاؤه؟",
        a: "نعم، ما دام لم يُشحن بعد: تواصلي معنا عبر واتساب أو على الرقم \u2066+212 6 74 42 73 40\u2069.",
      },
      {
        q: "هل يمكنني طلب عدة منتجات؟",
        a: "نعم، أضيفيها إلى السلة: تصلك معاً، والتوصيل دائماً مجاني.",
      },
    ],
    contactTitle: "عندك سؤال آخر؟",
    contactText: "راسلينا عبر واتساب، وسنجيبك بسرعة.",
    contactCta: "راسلينا عبر واتساب",
  },
};
