// src/lib/i18n.ts
export const locales = ['nl', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'nl';

export interface Translations {
  nav: { home: string; contact: string; apply: string };
  hero: { title: string; subtitle: string; cta: string; badge: string };
  benefits: { title: string; subtitle: string; items: string[]; description: string };
  steps: { title: string; subtitle: string; s1: string; s2: string; s3: string; s4: string; descriptions: string[] };
  form: { personal: string; financial: string; bank: string; docs: string; contract: string; payment: string };
  faq: { title: string; q1: string; a1: string; q2: string; a2: string; q3: string; a3: string; q4: string; a4: string };
  contact: { 
    title: string; 
    subtitle: string; 
    name: string; 
    email: string; 
    phone: string; 
    subject: string; 
    message: string; 
    send: string; 
    sending: string; 
    sentTitle: string; 
    sentDesc: string;
    newMessage: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    availabilityLabel: string;
    phoneValue: string;
    emailValue: string;
    addressValue: string;
    availabilityValue: string;
    subjectOptions: { info: string; support: string; loan: string; other: string };
    selectSubject: string;
  };
  footer: { 
    legal: string; 
    description: string;
    contactTitle: string;
    legalTitle: string;
    support: string;
    copyright: string;
  };
  stats: { clients: string; approval: string; experience: string };
  testimonials: { title: string; items: { text: string; name: string; role: string }[] };
  cta: { title: string; subtitle: string; button: string };
  socialProof: { clients: string; rating: string };
  stepsDescriptions: string[];
  loanModal: {
    title: string;
    step: string;
    of: string;
    previous: string;
    continue: string;
    paymentWaiting: string;
    close: string;
    step1: {
      lastName: string; firstName: string; birthDate: string; nationality: string;
      address: string; city: string; postalCode: string; country: string;
      phone: string; email: string;
    };
    step2: {
      amountRequested: string; currency: string; duration: string;
      monthlyIncome: string; profession: string; employer: string;
    };
    step3: {
      bankName: string; iban: string; bic: string; accountHolder: string;
    };
    step4: {
      idDocument: string; maxSize: string; proofOfAddress: string;
      lessThan3Months: string; payslip: string; last3Months: string;
    };
    step5: {
      contractTitle: string;
      sections: string[];
      acceptTerms: string;
      yourSignature: string;
    };
    step6: {
      finalizingTitle: string;
      finalizingDesc: string;
    };
  };
  signature: {
    signHere: string;
    clear: string;
  };
}

export function getTranslations(lang: Locale): Translations {
  return translations[lang];
}

const translations: Record<Locale, Translations> = {
  nl: {
    nav: {
      home: 'Home',
      contact: 'Contact',
      apply: 'Aanvraag indienen',
    },
    hero: {
      title: 'Professionele leningen voor uw toekomst',
      subtitle: 'Veilig, snel en volledig online.',
      cta: 'Lening aanvragen',
      badge: 'Snelle financiering binnen 24u',
    },
    benefits: {
      title: 'Waarom FondsLink?',
      subtitle: 'Ontdek waarom duizenden klanten voor onze financieringsoplossingen kiezen',
      items: ['Snelle validatie', '100% online proces', 'Elektronische handtekening', 'Meertalige ondersteuning', 'Gegevensbescherming', 'Beveiligde betaling'],
      description: 'Professionele service met gegarandeerde kwaliteit en veiligheid.',
    },
    steps: {
      title: 'Hoe het werkt',
      subtitle: 'Een eenvoudig proces in 4 stappen',
      s1: 'Formulier invullen',
      s2: 'Contract tekenen',
      s3: 'Administratieve kosten betalen',
      s4: 'Uw dossier is automatisch gevalideerd',
      descriptions: [
        'Vul het online formulier in enkele minuten in',
        'Ontvang en onderteken digitaal uw contract',
        'Veilige online betaling van administratiekosten',
        'Uw dossier wordt automatisch gevalideerd',
      ],
    },
    form: {
      personal: 'Persoonlijke gegevens',
      financial: 'Financiële gegevens',
      bank: 'Bankgegevens',
      docs: 'Documenten',
      contract: 'Contract',
      payment: 'Betaling',
    },
    faq: {
      title: 'FAQ',
      q1: 'Hoe lang duurt de validatie?',
      a1: 'De validatie is automatisch zodra de administratieve kosten zijn betaald.',
      q2: 'Zijn mijn gegevens veilig?',
      a2: 'Ja, wij gebruiken end-to-end encryptie en zijn GDPR-conform.',
      q3: 'Kan ik vervroegd aflossen?',
      a3: 'Ja, vervroegd aflossen is mogelijk zonder extra kosten. Wij moedigen financiële flexibiliteit aan.',
      q4: 'Welke documenten heb ik nodig?',
      a4: 'U heeft een geldig identiteitsbewijs, recente loonstrook en bankafschrift nodig.',
    },
    contact: {
      title: 'Contact',
      subtitle: 'Heeft u vragen? Ons team staat klaar om u te helpen. Vul het formulier in of neem direct contact met ons op.',
      name: 'Volledige naam',
      email: 'E-mailadres',
      phone: 'Telefoonnummer',
      subject: 'Onderwerp',
      message: 'Bericht',
      send: 'Verzenden',
      sending: 'Bezig met verzenden...',
      sentTitle: 'Bericht verzonden',
      sentDesc: 'We nemen zo snel mogelijk contact met u op.',
      newMessage: 'Nieuw bericht versturen',
      phoneLabel: 'Telefoon',
      emailLabel: 'Email',
      addressLabel: 'Adres',
      availabilityLabel: 'Beschikbaarheid',
      phoneValue: '+31 (0)20 123 45 67',
      emailValue: 'contact@fondslink.nl',
      addressValue: 'Amsterdam, Nederland',
      availabilityValue: 'Ma-Vr: 09:00 - 18:00',
      subjectOptions: {
        info: 'Algemene informatie',
        support: 'Technische ondersteuning',
        loan: 'Lening aanvraag',
        other: 'Anders',
      },
      selectSubject: 'Selecteer onderwerp',
    },
    footer: {
      legal: 'Conform Europese financiële regelgeving.',
      description: 'Professioneel platform voor online leningaanvragen. Veiligheid, snelheid en transparantie.',
      contactTitle: 'Contact',
      legalTitle: 'Juridisch',
      support: 'Meertalige ondersteuning 24/7',
      copyright: 'Alle rechten voorbehouden.',
    },
    stats: {
      clients: 'Tevreden klanten',
      approval: 'Goedkeuringspercentage',
      experience: 'Jaar ervaring',
    },
    testimonials: {
      title: 'Wat onze klanten zeggen',
      items: [
        {
          text: 'Uitstekende service! Mijn lening werd in minder dan 24 uur goedgekeurd. Het proces was eenvoudig en het team zeer professioneel.',
          name: 'Tevreden klant',
          role: 'Ondernemer',
        },
        {
          text: 'Een snelle en efficiënte financieringsoplossing. Ik beveel het ten zeerste aan bij alle ondernemers.',
          name: 'Tevreden klant',
          role: "ZZP'er",
        },
        {
          text: 'Team dat luistert en zeer responsief is. Het proces is transparant en de voorwaarden zijn duidelijk.',
          name: 'Tevreden klant',
          role: 'Directeur MKB',
        },
      ],
    },
    cta: {
      title: 'Klaar om uw project te realiseren?',
      subtitle: 'Sluit u aan bij duizenden tevreden klanten die ons vertrouwen voor hun financiering',
      button: 'Start mijn aanvraag',
    },
    socialProof: {
      clients: 'tevreden klanten',
      rating: 'klantbeoordeling',
    },
    stepsDescriptions: [
      'Vul het online formulier in enkele minuten in',
      'Ontvang en onderteken digitaal uw contract',
      'Veilige online betaling van administratiekosten',
      'Uw dossier wordt automatisch gevalideerd',
    ],
    loanModal: {
      title: 'Lening aanvraag',
      step: 'Stap',
      of: 'van',
      previous: 'Vorige',
      continue: 'Doorgaan',
      paymentWaiting: 'Betaling in afwachting...',
      close: 'Sluiten',
      step1: {
        lastName: 'Achternaam',
        firstName: 'Voornaam',
        birthDate: 'Geboortedatum',
        nationality: 'Nationaliteit',
        address: 'Adres',
        city: 'Stad',
        postalCode: 'Postcode',
        country: 'Land',
        phone: 'Telefoon',
        email: 'E-mail',
      },
      step2: {
        amountRequested: 'Gevraagd bedrag',
        currency: 'Valuta',
        duration: 'Looptijd (maanden)',
        monthlyIncome: 'Netto maandinkomen',
        profession: 'Beroep',
        employer: 'Huidige werkgever',
      },
      step3: {
        bankName: 'Banknaam',
        iban: 'IBAN',
        bic: 'BIC/SWIFT',
        accountHolder: 'Rekeninghouder',
      },
      step4: {
        idDocument: 'Identiteitskaart / Paspoort',
        maxSize: 'Max 5MB',
        proofOfAddress: 'Bewijs van adres',
        lessThan3Months: 'Minder dan 3 maanden',
        payslip: 'Loonstrook',
        last3Months: 'Laatste 3 maanden',
      },
      step5: {
        contractTitle: 'ELEKTRONISCHE LENINGSOVEREENKOMST',
        sections: [
          '1. DOEL: Deze overeenkomst regelt de relatie tussen FondsLink en de lener.',
          '2. BEDRAG EN LOOPTIJD: Volgens de informatie verstrekt bij de aanvraag.',
          '3. KOSTEN: Administratieve kosten en kosten voor het openen van een rekening zijn van toepassing vóór uitbetaling.',
          '4. HANDTEKENING: De elektronische handtekening heeft dezelfde juridische waarde als een handgeschreven handtekening.',
          '5. GEGEVENS: Uw gegevens worden verwerkt in overeenstemming met de AVG, alleen voor de beoordeling van de lening.',
        ],
        acceptTerms: 'Ik heb de algemene voorwaarden van de leningsovereenkomst gelezen en ga ermee akkoord.',
        yourSignature: 'Uw elektronische handtekening',
      },
      step6: {
        finalizingTitle: 'Afronding van het dossier',
        finalizingDesc: 'Gelieve de administratieve kosten en de kosten voor het openen van een rekening te betalen om uw lening automatisch te valideren.',
      },
    },
    signature: {
      signHere: 'Teken in de ruimte hierboven',
      clear: 'Wissen',
    },
  },
  en: {
    nav: {
      home: 'Home',
      contact: 'Contact',
      apply: 'Apply for a loan',
    },
    hero: {
      title: 'Professional loans for your future',
      subtitle: 'Secure, fast and fully online.',
      cta: 'Apply for a loan',
      badge: 'Fast financing within 24h',
    },
    benefits: {
      title: 'Why choose FondsLink?',
      subtitle: 'Discover why thousands of customers choose our financing solutions',
      items: ['Fast validation', '100% online process', 'Electronic signature', 'Multilingual support', 'Data protection', 'Secure payment'],
      description: 'Professional service with guaranteed quality and security.',
    },
    steps: {
      title: 'How it works',
      subtitle: 'A simple process in 4 steps',
      s1: 'Fill out the form',
      s2: 'Sign the contract',
      s3: 'Pay administrative fees',
      s4: 'Your file is automatically validated',
      descriptions: [
        'Fill out the online form in minutes',
        'Receive and digitally sign your contract',
        'Secure online payment of administrative fees',
        'Your file is automatically validated',
      ],
    },
    form: {
      personal: 'Personal information',
      financial: 'Financial information',
      bank: 'Bank details',
      docs: 'Documents',
      contract: 'Contract',
      payment: 'Payment',
    },
    faq: {
      title: 'FAQ',
      q1: 'How long does validation take?',
      a1: 'Validation is automatic once administrative fees are paid.',
      q2: 'Is my data secure?',
      a2: 'Yes, we use end-to-end encryption and are GDPR compliant.',
      q3: 'Can I repay early?',
      a3: 'Yes, early repayment is possible without additional fees. We encourage financial flexibility.',
      q4: 'What documents do I need?',
      a4: 'You need a valid ID, recent pay stub and bank statement.',
    },
    contact: {
      title: 'Contact',
      subtitle: 'Do you have questions? Our team is ready to help you. Fill out the form or contact us directly.',
      name: 'Full name',
      email: 'Email address',
      phone: 'Phone number',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      sentTitle: 'Message sent',
      sentDesc: 'We will get back to you as soon as possible.',
      newMessage: 'Send new message',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      addressLabel: 'Address',
      availabilityLabel: 'Availability',
      phoneValue: '+31 (0)20 123 45 67',
      emailValue: 'contactus@fondslink.com',
      addressValue: 'Amsterdam, Netherlands',
      availabilityValue: 'Mon-Fri: 9:00 AM - 6:00 PM',
      subjectOptions: {
        info: 'General information',
        support: 'Technical support',
        loan: 'Loan application',
        other: 'Other',
      },
      selectSubject: 'Select subject',
    },
    footer: {
      legal: 'Compliant with European financial regulations.',
      description: 'Professional platform for online loan applications. Security, speed and transparency.',
      contactTitle: 'Contact',
      legalTitle: 'Legal',
      support: 'Multilingual support 24/7',
      copyright: 'All rights reserved.',
    },
    stats: {
      clients: 'Satisfied customers',
      approval: 'Approval rate',
      experience: 'Years of experience',
    },
    testimonials: {
      title: 'What our customers say',
      items: [
        {
          text: 'Excellent service! My loan was approved in less than 24 hours. The process was simple and the team very professional.',
          name: 'Satisfied customer',
          role: 'Entrepreneur',
        },
        {
          text: 'A fast and efficient financing solution. I highly recommend it to all entrepreneurs.',
          name: 'Satisfied customer',
          role: 'Freelancer',
        },
        {
          text: 'A team that listens and is very responsive. The process is transparent and the conditions are clear.',
          name: 'Satisfied customer',
          role: 'SME Director',
        },
      ],
    },
    cta: {
      title: 'Ready to make your project happen?',
      subtitle: 'Join thousands of satisfied customers who trust us for their financing',
      button: 'Start my application',
    },
    socialProof: {
      clients: 'satisfied customers',
      rating: 'customer rating',
    },
    stepsDescriptions: [
      'Fill out the online form in minutes',
      'Receive and digitally sign your contract',
      'Secure online payment of administrative fees',
      'Your file is automatically validated',
    ],
    loanModal: {
      title: 'Loan application',
      step: 'Step',
      of: 'of',
      previous: 'Previous',
      continue: 'Continue',
      paymentWaiting: 'Payment pending...',
      close: 'Close',
      step1: {
        lastName: 'Last name',
        firstName: 'First name',
        birthDate: 'Date of birth',
        nationality: 'Nationality',
        address: 'Address',
        city: 'City',
        postalCode: 'Postal code',
        country: 'Country',
        phone: 'Phone',
        email: 'Email',
      },
      step2: {
        amountRequested: 'Amount requested',
        currency: 'Currency',
        duration: 'Duration (months)',
        monthlyIncome: 'Net monthly income',
        profession: 'Profession',
        employer: 'Current employer',
      },
      step3: {
        bankName: 'Bank name',
        iban: 'IBAN',
        bic: 'BIC/SWIFT',
        accountHolder: 'Account holder',
      },
      step4: {
        idDocument: 'ID Card / Passport',
        maxSize: 'Max 5MB',
        proofOfAddress: 'Proof of address',
        lessThan3Months: 'Less than 3 months',
        payslip: 'Payslip',
        last3Months: 'Last 3 months',
      },
      step5: {
        contractTitle: 'ELECTRONIC LOAN AGREEMENT',
        sections: [
          '1. PURPOSE: This agreement governs the relationship between FondsLink and the borrower.',
          '2. AMOUNT AND DURATION: According to the information provided during the application.',
          '3. FEES: Administrative and account opening fees are applicable before disbursement.',
          '4. SIGNATURE: The electronic signature has the same legal value as a handwritten signature.',
          '5. DATA: Your data is processed in accordance with GDPR, solely for loan assessment.',
        ],
        acceptTerms: 'I have read and agree to the terms and conditions of the loan agreement.',
        yourSignature: 'Your electronic signature',
      },
      step6: {
        finalizingTitle: 'Finalizing the file',
        finalizingDesc: 'Please pay the administrative fees and account opening fees to automatically validate your loan.',
      },
    },
    signature: {
      signHere: 'Sign in the space above',
      clear: 'Clear',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      contact: 'Contacto',
      apply: 'Solicitar préstamo',
    },
    hero: {
      title: 'Préstamos profesionales para su futuro',
      subtitle: 'Seguro, rápido y totalmente en línea.',
      cta: 'Solicitar préstamo',
      badge: 'Financiación rápida en 24h',
    },
    benefits: {
      title: '¿Por qué elegir FondsLink?',
      subtitle: 'Descubra por qué miles de clientes eligen nuestras soluciones de financiación',
      items: ['Validación rápida', 'Proceso 100% en línea', 'Firma electrónica', 'Soporte multilingüe', 'Protección de datos', 'Pago seguro'],
      description: 'Servicio profesional con calidad y seguridad garantizadas.',
    },
    steps: {
      title: 'Cómo funciona',
      subtitle: 'Un proceso simple en 4 pasos',
      s1: 'Rellenar el formulario',
      s2: 'Firmar el contrato',
      s3: 'Pagar tasas administrativas',
      s4: 'Su expediente se valida automáticamente',
      descriptions: [
        'Complete el formulario en línea en minutos',
        'Reciba y firme digitalmente su contrato',
        'Pago seguro en línea de tasas administrativas',
        'Su expediente se valida automáticamente',
      ],
    },
    form: {
      personal: 'Información personal',
      financial: 'Información financiera',
      bank: 'Datos bancarios',
      docs: 'Documentos',
      contract: 'Contrato',
      payment: 'Pago',
    },
    faq: {
      title: 'FAQ',
      q1: '¿Cuánto tiempo tarda la validación?',
      a1: 'La validación es automática una vez pagadas las tasas administrativas.',
      q2: '¿Mis datos están seguros?',
      a2: 'Sí, utilizamos cifrado de extremo a extremo y cumplimos con el RGPD.',
      q3: '¿Puedo amortizar anticipadamente?',
      a3: 'Sí, la amortización anticipada es posible sin costes adicionales. Fomentamos la flexibilidad financiera.',
      q4: '¿Qué documentos necesito?',
      a4: 'Necesita un documento de identidad válido, nómina reciente y extracto bancario.',
    },
    contact: {
      title: 'Contacto',
      subtitle: '¿Tiene preguntas? Nuestro equipo está listo para ayudarle. Rellene el formulario o contáctenos directamente.',
      name: 'Nombre completo',
      email: 'Correo electrónico',
      phone: 'Número de teléfono',
      subject: 'Asunto',
      message: 'Mensaje',
      send: 'Enviar',
      sending: 'Enviando...',
      sentTitle: 'Mensaje enviado',
      sentDesc: 'Nos pondremos en contacto con usted lo antes posible.',
      newMessage: 'Enviar nuevo mensaje',
      phoneLabel: 'Teléfono',
      emailLabel: 'Email',
      addressLabel: 'Dirección',
      availabilityLabel: 'Disponibilidad',
      phoneValue: '+31 (0)20 123 45 67',
      emailValue: 'contacto@fondslink.com',
      addressValue: 'Ámsterdam, Países Bajos',
      availabilityValue: 'Lun-Vie: 09:00 - 18:00',
      subjectOptions: {
        info: 'Información general',
        support: 'Soporte técnico',
        loan: 'Solicitud de préstamo',
        other: 'Otro',
      },
      selectSubject: 'Seleccionar asunto',
    },
    footer: {
      legal: 'Cumple con la normativa financiera europea.',
      description: 'Plataforma profesional para solicitudes de préstamos en línea. Seguridad, rapidez y transparencia.',
      contactTitle: 'Contacto',
      legalTitle: 'Legal',
      support: 'Soporte multilingüe 24/7',
      copyright: 'Todos los derechos reservados.',
    },
    stats: {
      clients: 'Clientes satisfechos',
      approval: 'Tasa de aprobación',
      experience: 'Años de experiencia',
    },
    testimonials: {
      title: 'Lo que dicen nuestros clientes',
      items: [
        {
          text: '¡Servicio excelente! Mi préstamo fue aprobado en menos de 24 horas. El proceso fue simple y el equipo muy profesional.',
          name: 'Cliente satisfecho',
          role: 'Emprendedor',
        },
        {
          text: 'Una solución de financiación rápida y eficiente. Lo recomiendo encarecidamente a todos los emprendedores.',
          name: 'Cliente satisfecho',
          role: 'Freelance',
        },
        {
          text: 'Un equipo que escucha y es muy receptivo. El proceso es transparente y las condiciones son claras.',
          name: 'Cliente satisfecho',
          role: 'Director PYME',
        },
      ],
    },
    cta: {
      title: '¿Listo para hacer realidad su proyecto?',
      subtitle: 'Únase a miles de clientes satisfechos que confían en nosotros para su financiación',
      button: 'Iniciar mi solicitud',
    },
    socialProof: {
      clients: 'clientes satisfechos',
      rating: 'valoración clientes',
    },
    stepsDescriptions: [
      'Complete el formulario en línea en minutos',
      'Reciba y firme digitalmente su contrato',
      'Pago seguro en línea de tasas administrativas',
      'Su expediente se valida automáticamente',
    ],
    loanModal: {
      title: 'Solicitud de préstamo',
      step: 'Paso',
      of: 'de',
      previous: 'Anterior',
      continue: 'Continuar',
      paymentWaiting: 'Pago pendiente...',
      close: 'Cerrar',
      step1: {
        lastName: 'Apellido',
        firstName: 'Nombre',
        birthDate: 'Fecha de nacimiento',
        nationality: 'Nacionalidad',
        address: 'Dirección',
        city: 'Ciudad',
        postalCode: 'Código postal',
        country: 'País',
        phone: 'Teléfono',
        email: 'Correo electrónico',
      },
      step2: {
        amountRequested: 'Cantidad solicitada',
        currency: 'Moneda',
        duration: 'Duración (meses)',
        monthlyIncome: 'Ingreso mensual neto',
        profession: 'Profesión',
        employer: 'Empleador actual',
      },
      step3: {
        bankName: 'Nombre del banco',
        iban: 'IBAN',
        bic: 'BIC/SWIFT',
        accountHolder: 'Titular de la cuenta',
      },
      step4: {
        idDocument: 'Documento de identidad / Pasaporte',
        maxSize: 'Máx 5MB',
        proofOfAddress: 'Comprobante de domicilio',
        lessThan3Months: 'Menos de 3 meses',
        payslip: 'Nómina',
        last3Months: 'Últimos 3 meses',
      },
      step5: {
        contractTitle: 'CONTRATO DE PRÉSTAMO ELECTRÓNICO',
        sections: [
          '1. OBJETO: El presente contrato regula la relación entre FondsLink y el prestatario.',
          '2. IMPORTE Y DURACIÓN: Según la información proporcionada durante la solicitud.',
          '3. GASTOS: Se aplican gastos administrativos y de apertura de cuenta antes del desembolso.',
          '4. FIRMA: La firma electrónica tiene el mismo valor legal que una firma manuscrita.',
          '5. DATOS: Sus datos se procesan de conformidad con el RGPD, únicamente para la evaluación del préstamo.',
        ],
        acceptTerms: 'He leído y acepto los términos y condiciones del contrato de préstamo.',
        yourSignature: 'Su firma electrónica',
      },
      step6: {
        finalizingTitle: 'Finalización del expediente',
        finalizingDesc: 'Por favor, pague las tasas administrativas y de apertura de cuenta para validar automáticamente su préstamo.',
      },
    },
    signature: {
      signHere: 'Firme en el espacio superior',
      clear: 'Borrar',
    },
  },
};
