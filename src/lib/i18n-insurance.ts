// src/lib/i18n-insurance.ts
//
// Fichier de traductions AUTONOME pour le module "Assurance".
// Il ne modifie ni ne dépend d'aucun contenu de src/lib/i18n.ts.
// Il réutilise seulement le type `Locale` exporté par i18n.ts.

import type { Locale } from './i18n';

export interface InsuranceTranslations {
  navLabel: string; // libellé du lien de menu ("Assurance" / "Insurance" / "Seguro")
  pageTitle: string;
  pageSubtitle: string;
  ctaButton: string;
  testModeBanner: string;

  modal: {
    title: string;
    step: string;
    of: string;
    previous: string;
    continue: string;
    close: string;
    requiredField: string;
    fileRequired: string;
    mustAcceptTerms: string;
    signatureRequired: string;

    typeSelection: {
      heading: string;
      vehicle: string;
      vehicleDesc: string;
      home: string;
      homeDesc: string;
    };

    personal: {
      title: string;
      lastName: string; firstName: string; birthDate: string; nationality: string;
      address: string; city: string; postalCode: string; country: string;
      phone: string; email: string;
    };

    vehicle: {
      title: string;
      brand: string; model: string; year: string; plateNumber: string;
      registrationDate: string; usageType: string;
      usagePersonal: string; usageProfessional: string; usageMixed: string;
      estimatedValue: string; annualMileage: string;
    };

    home: {
      title: string;
      propertyType: string;
      typeApartment: string; typeHouse: string; typeOther: string;
      surfaceArea: string; constructionYear: string; propertyValue: string;
      numberOfRooms: string; hasAlarm: string; occupancyStatus: string;
      occupancyOwner: string; occupancyTenant: string;
    };

    coverage: {
      title: string;
      coverageLevel: string;
      basic: string; basicDesc: string; basicPrice: number;
      standard: string; standardDesc: string; standardPrice: number;
      premium: string; premiumDesc: string; premiumPrice: number;
      monthlyPremium: string;
    };

    docs: {
      title: string;
      idDocument: string; maxSize: string;
      proofOfAddress: string; lessThan3Months: string;
      vehicleRegistration: string;
      propertyDeed: string;
    };

    contract: {
      title: string;
      contractTitle: string;
      sections: string[];
      acceptTerms: string;
      yourSignature: string;
    };

    final: {
      finalizingTitle: string;
      finalizingDesc: string;
      linkReadyTitle: string;
      premiumLabel: string;
      premiumNote: string;
      emailSentNote: string;
      payNow: string;
      retry: string;
      errorGeneric: string;
      errorNetwork: string;
    };
  };
}

const nl: InsuranceTranslations = {
  navLabel: 'Verzekering',
  pageTitle: 'Verzekeringsaanvraag (Oefening)',
  pageSubtitle: 'Simuleer een aanvraag voor voertuig- of woonverzekering. Dit is een educatieve testomgeving.',
  ctaButton: 'Simulatie starten',
  testModeBanner: '🧪 TESTOMGEVING — dit is een opleidingsoefening. Geen enkele echte betaling wordt verwerkt en er wordt geen echte e-mail verzonden.',
  modal: {
    title: 'Verzekeringsaanvraag',
    step: 'Stap',
    of: 'van',
    previous: 'Vorige',
    continue: 'Doorgaan',
    close: 'Sluiten',
    requiredField: 'Verplicht veld',
    fileRequired: 'Bestand vereist',
    mustAcceptTerms: 'U moet de voorwaarden accepteren',
    signatureRequired: 'Handtekening vereist',
    typeSelection: {
      heading: 'Welk type verzekering wilt u aanvragen?',
      vehicle: 'Voertuigverzekering',
      vehicleDesc: 'Auto, motor of ander gemotoriseerd voertuig',
      home: 'Woonverzekering',
      homeDesc: 'Appartement, huis of andere woning',
    },
    personal: {
      title: 'Persoonlijke gegevens',
      lastName: 'Achternaam', firstName: 'Voornaam', birthDate: 'Geboortedatum', nationality: 'Nationaliteit',
      address: 'Adres', city: 'Stad', postalCode: 'Postcode', country: 'Land',
      phone: 'Telefoon', email: 'E-mail',
    },
    vehicle: {
      title: 'Voertuiggegevens',
      brand: 'Merk', model: 'Model', year: 'Bouwjaar', plateNumber: 'Kenteken',
      registrationDate: 'Registratiedatum', usageType: 'Gebruikstype',
      usagePersonal: 'Persoonlijk', usageProfessional: 'Professioneel', usageMixed: 'Gemengd',
      estimatedValue: 'Geschatte waarde', annualMileage: 'Jaarlijkse kilometrage',
    },
    home: {
      title: 'Woninggegevens',
      propertyType: 'Type woning',
      typeApartment: 'Appartement', typeHouse: 'Huis', typeOther: 'Anders',
      surfaceArea: 'Oppervlakte (m²)', constructionYear: 'Bouwjaar', propertyValue: 'Geschatte waarde',
      numberOfRooms: 'Aantal kamers', hasAlarm: 'Heeft alarmsysteem', occupancyStatus: 'Bewoningsstatus',
      occupancyOwner: 'Eigenaar', occupancyTenant: 'Huurder',
    },
    coverage: {
      title: 'Kies uw dekking',
      coverageLevel: 'Dekkingsniveau',
      basic: 'Basis', basicDesc: 'Essentiële wettelijke dekking', basicPrice: 15,
      standard: 'Standaard', standardDesc: 'Uitgebreide dekking met bijstand', standardPrice: 29,
      premium: 'Premium', premiumDesc: 'Volledige dekking, alle risico\'s', premiumPrice: 49,
      monthlyPremium: 'Geschatte maandelijkse premie (simulatie)',
    },
    docs: {
      title: 'Documenten',
      idDocument: 'Identiteitskaart / Paspoort', maxSize: 'Max 5MB',
      proofOfAddress: 'Bewijs van adres', lessThan3Months: 'Minder dan 3 maanden',
      vehicleRegistration: 'Kentekenbewijs',
      propertyDeed: 'Eigendomsbewijs of huurcontract',
    },
    contract: {
      title: 'Contract',
      contractTitle: 'ELEKTRONISCHE VERZEKERINGSOVEREENKOMST — OEFENDOCUMENT',
      sections: [
        '1. DOEL: Dit is een OEFENDOCUMENT gemaakt in het kader van een opleiding. Dit is GEEN echte verzekeringsovereenkomst en heeft geen juridische waarde.',
        '2. DEKKING: Volgens het niveau geselecteerd in de vorige stap (simulatie).',
        '3. PREMIE: De weergegeven premie is fictief en dient uitsluitend voor educatieve doeleinden.',
        '4. HANDTEKENING: Deze elektronische handtekening is uitsluitend bedoeld om de handtekeningfunctionaliteit te testen.',
        '5. GEGEVENS: Deze gegevens worden alleen lokaal gebruikt binnen de opleidingsoefening.',
      ],
      acceptTerms: 'Ik begrijp dat dit een simulatie/oefening is en ga akkoord met de testvoorwaarden.',
      yourSignature: 'Uw elektronische handtekening (test)',
    },
    final: {
      finalizingTitle: 'Afronding van de simulatie',
      finalizingDesc: 'Wij bereiden uw testlink voor, een ogenblik geduld.',
      linkReadyTitle: 'Uw testsimulatie is klaar',
      premiumLabel: 'Gesimuleerde premie:',
      premiumNote: '(fictief bedrag — geen echte transactie)',
      emailSentNote: 'Testmodus: er wordt geen echte e-mail verzonden.',
      payNow: 'Simulatie bekijken',
      retry: 'Opnieuw proberen',
      errorGeneric: 'Er is een fout opgetreden in de simulatie. Probeer het opnieuw.',
      errorNetwork: 'Netwerkfout, probeer het opnieuw.',
    },
  },
};

const en: InsuranceTranslations = {
  navLabel: 'Insurance',
  pageTitle: 'Insurance Application (Training Exercise)',
  pageSubtitle: 'Simulate a vehicle or home insurance application. This is an educational test environment.',
  ctaButton: 'Start simulation',
  testModeBanner: '🧪 TEST ENVIRONMENT — this is a training exercise. No real payment is ever processed and no real email is sent.',
  modal: {
    title: 'Insurance application',
    step: 'Step',
    of: 'of',
    previous: 'Previous',
    continue: 'Continue',
    close: 'Close',
    requiredField: 'Required field',
    fileRequired: 'File required',
    mustAcceptTerms: 'You must accept the terms',
    signatureRequired: 'Signature required',
    typeSelection: {
      heading: 'Which type of insurance would you like to apply for?',
      vehicle: 'Vehicle insurance',
      vehicleDesc: 'Car, motorcycle or other motor vehicle',
      home: 'Home insurance',
      homeDesc: 'Apartment, house or other property',
    },
    personal: {
      title: 'Personal information',
      lastName: 'Last name', firstName: 'First name', birthDate: 'Date of birth', nationality: 'Nationality',
      address: 'Address', city: 'City', postalCode: 'Postal code', country: 'Country',
      phone: 'Phone', email: 'Email',
    },
    vehicle: {
      title: 'Vehicle details',
      brand: 'Brand', model: 'Model', year: 'Year', plateNumber: 'License plate',
      registrationDate: 'Registration date', usageType: 'Usage type',
      usagePersonal: 'Personal', usageProfessional: 'Professional', usageMixed: 'Mixed',
      estimatedValue: 'Estimated value', annualMileage: 'Annual mileage',
    },
    home: {
      title: 'Property details',
      propertyType: 'Property type',
      typeApartment: 'Apartment', typeHouse: 'House', typeOther: 'Other',
      surfaceArea: 'Surface area (m²)', constructionYear: 'Construction year', propertyValue: 'Estimated value',
      numberOfRooms: 'Number of rooms', hasAlarm: 'Has alarm system', occupancyStatus: 'Occupancy status',
      occupancyOwner: 'Owner', occupancyTenant: 'Tenant',
    },
    coverage: {
      title: 'Choose your coverage',
      coverageLevel: 'Coverage level',
      basic: 'Basic', basicDesc: 'Essential legal coverage', basicPrice: 15,
      standard: 'Standard', standardDesc: 'Extended coverage with assistance', standardPrice: 29,
      premium: 'Premium', premiumDesc: 'Full coverage, all risks', premiumPrice: 49,
      monthlyPremium: 'Estimated monthly premium (simulation)',
    },
    docs: {
      title: 'Documents',
      idDocument: 'ID Card / Passport', maxSize: 'Max 5MB',
      proofOfAddress: 'Proof of address', lessThan3Months: 'Less than 3 months',
      vehicleRegistration: 'Vehicle registration document',
      propertyDeed: 'Property deed or rental agreement',
    },
    contract: {
      title: 'Contract',
      contractTitle: 'ELECTRONIC INSURANCE AGREEMENT — TRAINING DOCUMENT',
      sections: [
        '1. PURPOSE: This is a TRAINING DOCUMENT created for an educational exercise. This is NOT a real insurance agreement and has no legal value.',
        '2. COVERAGE: According to the level selected in the previous step (simulation).',
        '3. PREMIUM: The displayed premium is fictional and for educational purposes only.',
        '4. SIGNATURE: This electronic signature is solely intended to test the signature functionality.',
        '5. DATA: This data is used only locally within the training exercise.',
      ],
      acceptTerms: 'I understand this is a simulation/exercise and agree to the test terms.',
      yourSignature: 'Your electronic signature (test)',
    },
    final: {
      finalizingTitle: 'Finalizing the simulation',
      finalizingDesc: 'We are preparing your test link, please wait.',
      linkReadyTitle: 'Your test simulation is ready',
      premiumLabel: 'Simulated premium:',
      premiumNote: '(fictional amount — no real transaction)',
      emailSentNote: 'Test mode: no real email is sent.',
      payNow: 'View simulation',
      retry: 'Retry',
      errorGeneric: 'An error occurred in the simulation. Please try again.',
      errorNetwork: 'Network error, please try again.',
    },
  },
};

const es: InsuranceTranslations = {
  navLabel: 'Seguro',
  pageTitle: 'Solicitud de seguro (Ejercicio de formación)',
  pageSubtitle: 'Simule una solicitud de seguro de vehículo u hogar. Este es un entorno de prueba educativo.',
  ctaButton: 'Iniciar simulación',
  testModeBanner: '🧪 ENTORNO DE PRUEBA — esto es un ejercicio de formación. Nunca se procesa un pago real y no se envía ningún correo real.',
  modal: {
    title: 'Solicitud de seguro',
    step: 'Paso',
    of: 'de',
    previous: 'Anterior',
    continue: 'Continuar',
    close: 'Cerrar',
    requiredField: 'Campo requerido',
    fileRequired: 'Archivo requerido',
    mustAcceptTerms: 'Debe aceptar las condiciones',
    signatureRequired: 'Firma requerida',
    typeSelection: {
      heading: '¿Qué tipo de seguro desea solicitar?',
      vehicle: 'Seguro de vehículo',
      vehicleDesc: 'Coche, moto u otro vehículo motorizado',
      home: 'Seguro de hogar',
      homeDesc: 'Apartamento, casa u otra propiedad',
    },
    personal: {
      title: 'Información personal',
      lastName: 'Apellido', firstName: 'Nombre', birthDate: 'Fecha de nacimiento', nationality: 'Nacionalidad',
      address: 'Dirección', city: 'Ciudad', postalCode: 'Código postal', country: 'País',
      phone: 'Teléfono', email: 'Correo electrónico',
    },
    vehicle: {
      title: 'Datos del vehículo',
      brand: 'Marca', model: 'Modelo', year: 'Año', plateNumber: 'Matrícula',
      registrationDate: 'Fecha de matriculación', usageType: 'Tipo de uso',
      usagePersonal: 'Personal', usageProfessional: 'Profesional', usageMixed: 'Mixto',
      estimatedValue: 'Valor estimado', annualMileage: 'Kilometraje anual',
    },
    home: {
      title: 'Datos de la vivienda',
      propertyType: 'Tipo de vivienda',
      typeApartment: 'Apartamento', typeHouse: 'Casa', typeOther: 'Otro',
      surfaceArea: 'Superficie (m²)', constructionYear: 'Año de construcción', propertyValue: 'Valor estimado',
      numberOfRooms: 'Número de habitaciones', hasAlarm: 'Tiene sistema de alarma', occupancyStatus: 'Estado de ocupación',
      occupancyOwner: 'Propietario', occupancyTenant: 'Inquilino',
    },
    coverage: {
      title: 'Elija su cobertura',
      coverageLevel: 'Nivel de cobertura',
      basic: 'Básica', basicDesc: 'Cobertura legal esencial', basicPrice: 15,
      standard: 'Estándar', standardDesc: 'Cobertura ampliada con asistencia', standardPrice: 29,
      premium: 'Premium', premiumDesc: 'Cobertura completa, todo riesgo', premiumPrice: 49,
      monthlyPremium: 'Prima mensual estimada (simulación)',
    },
    docs: {
      title: 'Documentos',
      idDocument: 'Documento de identidad / Pasaporte', maxSize: 'Máx 5MB',
      proofOfAddress: 'Comprobante de domicilio', lessThan3Months: 'Menos de 3 meses',
      vehicleRegistration: 'Permiso de circulación',
      propertyDeed: 'Escritura de propiedad o contrato de alquiler',
    },
    contract: {
      title: 'Contrato',
      contractTitle: 'CONTRATO DE SEGURO ELECTRÓNICO — DOCUMENTO DE FORMACIÓN',
      sections: [
        '1. OBJETO: Este es un DOCUMENTO DE FORMACIÓN creado para un ejercicio educativo. Esto NO es un contrato de seguro real y no tiene valor legal.',
        '2. COBERTURA: Según el nivel seleccionado en el paso anterior (simulación).',
        '3. PRIMA: La prima mostrada es ficticia y solo tiene fines educativos.',
        '4. FIRMA: Esta firma electrónica está destinada únicamente a probar la funcionalidad de firma.',
        '5. DATOS: Estos datos se utilizan únicamente de forma local dentro del ejercicio de formación.',
      ],
      acceptTerms: 'Entiendo que esto es una simulación/ejercicio y acepto las condiciones de prueba.',
      yourSignature: 'Su firma electrónica (prueba)',
    },
    final: {
      finalizingTitle: 'Finalización de la simulación',
      finalizingDesc: 'Estamos preparando su enlace de prueba, un momento por favor.',
      linkReadyTitle: 'Su simulación de prueba está lista',
      premiumLabel: 'Prima simulada:',
      premiumNote: '(importe ficticio — sin transacción real)',
      emailSentNote: 'Modo de prueba: no se envía ningún correo real.',
      payNow: 'Ver simulación',
      retry: 'Reintentar',
      errorGeneric: 'Se produjo un error en la simulación. Inténtelo de nuevo.',
      errorNetwork: 'Error de red, inténtelo de nuevo.',
    },
  },
};

const insuranceTranslations: Record<Locale, InsuranceTranslations> = { nl, en, es };

export function getInsuranceTranslations(lang: Locale): InsuranceTranslations {
  return insuranceTranslations[lang] || insuranceTranslations.nl;
}
