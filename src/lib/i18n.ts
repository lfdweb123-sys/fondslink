// src/lib/i18n.ts
export const locales = ['nl', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'nl';

export function getLocaleFromPath(pathname: string): Locale {
  const locale = pathname.split('/')[1] as Locale;
  return locales.includes(locale) ? locale : defaultLocale;
}

export function getTranslations(lang: Locale) {
  return {
    nav: {
      home: lang === 'nl' ? 'Home' : lang === 'en' ? 'Home' : 'Inicio',
      contact: lang === 'nl' ? 'Contact' : lang === 'en' ? 'Contact' : 'Contacto',
      apply: lang === 'nl' ? 'Aanvraag indienen' : lang === 'en' ? 'Apply for a loan' : 'Solicitar préstamo',
    },
    hero: {
      title: lang === 'nl' 
        ? 'Professionele leningen voor uw toekomst' 
        : lang === 'en' 
          ? 'Professional loans for your future' 
          : 'Préstamos profesionales para su futuro',
      subtitle: lang === 'nl'
        ? 'Veilig, snel en volledig online.'
        : lang === 'en'
          ? 'Secure, fast and fully online.'
          : 'Seguro, rápido y totalmente en línea.',
      cta: lang === 'nl'
        ? 'Lening aanvragen'
        : lang === 'en'
          ? 'Apply for a loan'
          : 'Solicitar préstamo',
    },
    benefits: {
      title: lang === 'nl' ? 'Waarom FondsLink?' : lang === 'en' ? 'Why choose FondsLink?' : '¿Por qué elegir FondsLink?',
      items: lang === 'nl'
        ? ['Snelle validatie', '100% online proces', 'Elektronische handtekening', 'Meertalige ondersteuning', 'Gegevensbescherming', 'Beveiligde betaling']
        : lang === 'en'
          ? ['Fast validation', '100% online process', 'Electronic signature', 'Multilingual support', 'Data protection', 'Secure payment']
          : ['Validación rápida', 'Proceso 100% en línea', 'Firma electrónica', 'Soporte multilingüe', 'Protección de datos', 'Pago seguro'],
    },
    steps: {
      title: lang === 'nl' ? 'Hoe het werkt' : lang === 'en' ? 'How it works' : 'Cómo funciona',
      s1: lang === 'nl' ? 'Formulier invullen' : lang === 'en' ? 'Fill out the form' : 'Rellenar el formulario',
      s2: lang === 'nl' ? 'Contract tekenen' : lang === 'en' ? 'Sign the contract' : 'Firmar el contrato',
      s3: lang === 'nl' ? 'Administratieve kosten betalen' : lang === 'en' ? 'Pay administrative fees' : 'Pagar tasas administrativas',
      s4: lang === 'nl' ? 'Uw dossier is automatisch gevalideerd' : lang === 'en' ? 'Your file is automatically validated' : 'Su expediente se valida automáticamente',
    },
    form: {
      personal: lang === 'nl' ? 'Persoonlijke gegevens' : lang === 'en' ? 'Personal information' : 'Información personal',
      financial: lang === 'nl' ? 'Financiële gegevens' : lang === 'en' ? 'Financial information' : 'Información financiera',
      bank: lang === 'nl' ? 'Bankgegevens' : lang === 'en' ? 'Bank details' : 'Datos bancarios',
      docs: lang === 'nl' ? 'Documenten' : lang === 'en' ? 'Documents' : 'Documentos',
      contract: lang === 'nl' ? 'Contract' : lang === 'en' ? 'Contract' : 'Contrato',
      payment: lang === 'nl' ? 'Betaling' : lang === 'en' ? 'Payment' : 'Pago',
    },
    faq: {
      q1: lang === 'nl' ? 'Hoe lang duurt de validatie?' : lang === 'en' ? 'How long does validation take?' : '¿Cuánto tiempo tarda la validación?',
      a1: lang === 'nl' ? 'De validatie is automatisch zodra de administratieve kosten zijn betaald.' : lang === 'en' ? 'Validation is automatic once administrative fees are paid.' : 'La validación es automática una vez pagadas las tasas administrativas.',
      q2: lang === 'nl' ? 'Zijn mijn gegevens veilig?' : lang === 'en' ? 'Is my data secure?' : '¿Mis datos están seguros?',
      a2: lang === 'nl' ? 'Ja, wij gebruiken end-to-end encryptie en zijn GDPR-conform.' : lang === 'en' ? 'Yes, we use end-to-end encryption and are GDPR compliant.' : 'Sí, utilizamos cifrado de extremo a extremo y cumplimos con el RGPD.',
    },
    contact: {
      name: lang === 'nl' ? 'Volledige naam' : lang === 'en' ? 'Full name' : 'Nombre completo',
      email: lang === 'nl' ? 'E-mailadres' : lang === 'en' ? 'Email address' : 'Correo electrónico',
      phone: lang === 'nl' ? 'Telefoonnummer' : lang === 'en' ? 'Phone number' : 'Número de teléfono',
      subject: lang === 'nl' ? 'Onderwerp' : lang === 'en' ? 'Subject' : 'Asunto',
      message: lang === 'nl' ? 'Bericht' : lang === 'en' ? 'Message' : 'Mensaje',
      send: lang === 'nl' ? 'Verzenden' : lang === 'en' ? 'Send' : 'Enviar',
      sending: lang === 'nl' ? 'Bezig met verzenden...' : lang === 'en' ? 'Sending...' : 'Enviando...',
      sentTitle: lang === 'nl' ? 'Bericht verzonden' : lang === 'en' ? 'Message sent' : 'Mensaje enviado',
      sentDesc: lang === 'nl' ? 'We nemen zo snel mogelijk contact met u op.' : lang === 'en' ? 'We will get back to you as soon as possible.' : 'Nos pondremos en contacto contigo lo antes posible.',
    },
    footer: {
      legal: lang === 'nl' ? 'Conform Europese financiële regelgeving.' : lang === 'en' ? 'Compliant with European financial regulations.' : 'Cumple con la normativa financiera europea.',
    }
  };
}