import type { Packet } from '@/data/types';

/** Six supporting cases. Each packet is under 250 words and follows its planted issue. */

export const ALVAREZ_PACKET: Packet = {
  caseId: 'MIA-2026-1142',
  documents: [
    {
      title: 'Permit application: rooftop solar',
      letterhead: { kind: 'city_form', org: 'City of Miami Building Department', sub: 'Permit application: rooftop solar', formNumber: 'Form BD-112 (2026)' },
      received: '2026-09-12',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Applicant and owner', value: 'Luis Alvarez' },
            { label: 'Property address', value: '78 Coral Way Terrace, Miami, FL 33145' },
            { label: 'Parcel', value: '01-3120-044-0110' },
            { label: 'Email', value: 'luis.alvarez@example.com' },
            { label: 'Mobile', value: '(305) 555-0177' },
          ],
        },
        { type: 'heading', text: 'Scope of work' },
        { type: 'para', text: 'Rooftop solar photovoltaic array, 6.4 kW DC, 16 modules on the south roof plane of the house.' },
        { type: 'heading', text: 'Contractor' },
        {
          type: 'fields',
          items: [
            { label: 'Contractor', value: 'Brightline Solar Inc.' },
            { label: 'Licence', value: 'EC13008888' },
            { label: 'Licence expires', value: '15 Mar 2028' },
          ],
        },
        { type: 'signature', name: 'Luis Alvarez', role: 'Owner', date: '2026-09-12' },
      ],
    },
    {
      title: 'Solar single-line diagram notes',
      letterhead: { kind: 'contractor', org: 'Brightline Solar Inc.', sub: 'Solar design · EC13008888 · Sheet PV-2' },
      received: '2026-09-12',
      blocks: [
        { type: 'para', text: '78 Coral Way Terrace. Parcel 01-3120-044-0110. Owner: Luis Alvarez.' },
        {
          type: 'list',
          items: ['Main service panel: 200 A, with a 30 A solar backfeed breaker', 'Inverter: 5.0 kW AC, string type, garage wall.', 'AC disconnect: lockable, exterior, beside the meter.'],
        },
        { type: 'drawing', drawing: { kind: 'single_line', panelRating: '200 A', backfeedBreaker: '30 A', inverter: '5.0 kW' }, caption: 'Single-line diagram' },
      ],
    },
    {
      title: 'Solar equipment and structural',
      letterhead: { kind: 'contractor', org: 'Brightline Solar Inc.', sub: 'Solar design · EC13008888 · Sheet PV-3' },
      received: '2026-09-12',
      blocks: [
        { type: 'heading', text: 'Equipment specification sheets' },
        { type: 'list', items: ['Module: SunPeak SP-400M, 400 W. UL 61730 listed.', 'Inverter: VoltaLine VL-5000, 5.0 kW. UL 1741 listed.'] },
        { type: 'heading', text: 'Wind load letter' },
        { type: 'para', text: 'Attachment design for the High-Velocity Hurricane Zone, 175 mph design wind speed.' },
        { type: 'seal', text: 'Signed and sealed by M. Oduya, PE 55502, 2 Sep 2026' },
        { type: 'heading', text: 'Roof plan' },
        { type: 'drawing', drawing: { kind: 'roof_plan', pathway: '36"', ridgeSetback: '18"', modules: 16 }, caption: 'Roof plan, south plane' },
        { type: 'list', items: ['36 in pathway from eave to ridge on the east side of the array.', 'Ridge setback: 18 in'] },
      ],
    },
  ],
};

export const KIM_PACKET: Packet = {
  caseId: 'MIA-2026-1156',
  documents: [
    {
      title: 'Permit application: accessory dwelling unit',
      letterhead: { kind: 'city_form', org: 'City of Miami Building Department', sub: 'Permit application: accessory dwelling unit', formNumber: 'Form BD-113 (2026)' },
      received: '2026-09-15',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Applicant and owner', value: 'Grace Kim' },
            { label: 'Property address', value: '1530 Banyan Grove Lane, Miami, FL 33143' },
            { label: 'Parcel', value: '01-4103-021-0350' },
            { label: 'Email', value: 'grace.kim@example.com' },
          ],
        },
        { type: 'heading', text: 'Scope of work' },
        { type: 'para', text: 'Detached accessory dwelling unit of 520 sq ft in the rear yard, one bedroom.' },
        { type: 'heading', text: 'Contractor' },
        {
          type: 'fields',
          items: [
            { label: 'Contractor', value: 'Palm Coast Builders LLC' },
            { label: 'Licence', value: 'CGC1555555' },
            { label: 'Licence expires', value: '31 Aug 2028' },
          ],
        },
        { type: 'signature', name: 'Grace Kim', role: 'Owner', date: '2026-09-15' },
      ],
    },
    {
      title: 'ADU site plan notes',
      letterhead: { kind: 'contractor', org: 'Palm Coast Builders LLC', sub: 'Residential construction · CGC1555555 · Sheet A-1' },
      received: '2026-09-15',
      blocks: [
        { type: 'drawing', drawing: { kind: 'site_plan', rearSetback: "10'-0\"", sideSetback: "7'-6\"", aduLabel: 'ADU 520 SF' }, caption: 'Site plan, not to scale' },
        { type: 'list', items: ['Zoning: T3-R. No existing accessory dwelling unit on the lot.', 'Rear setback: 10 ft 0 in', 'Side setback: 7 ft 6 in', 'ADU floor area: 520 sq ft'] },
      ],
    },
    {
      title: 'Boundary survey',
      letterhead: { kind: 'surveyor', org: 'Bayline Land Surveying, Inc.', sub: 'Professional surveyors and mappers · LB 5555' },
      received: '2026-09-15',
      blocks: [
        { type: 'para', text: 'Parcel 01-4103-021-0350. Owner: Grace Kim. 1530 Banyan Grove Lane.' },
        { type: 'para', text: 'Proposed ADU footprint is 10 ft 0 in from the rear lot line and 7 ft 6 in from the west side lot line.' },
        { type: 'drawing', drawing: { kind: 'survey', rearDistance: "10'-0\"", sideDistance: "7'-6\"" }, caption: 'Survey sketch, not to scale' },
        { type: 'seal', text: 'Signed and sealed by R. Ortega, PSM 5555, 9 Sep 2026' },
      ],
    },
    {
      title: 'Elevation certificate',
      letterhead: { kind: 'fema', org: 'Elevation certificate', sub: 'National Flood Insurance Program form, synthetic copy' },
      received: '2026-09-15',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Building', value: 'Proposed accessory dwelling unit' },
            { label: 'Flood zone', value: 'AE' },
            { label: 'Base flood elevation', value: '8.0 ft NAVD' },
            { label: 'Lowest finished floor', value: '9.6 ft NAVD' },
          ],
        },
        { type: 'para', text: 'Finished floor is 1.6 ft above the base flood elevation.' },
        { type: 'seal', text: 'Certified by R. Ortega, PSM 5555, 9 Sep 2026' },
      ],
    },
    {
      title: 'Owner-occupancy affidavit',
      letterhead: { kind: 'affidavit', org: 'Owner-occupancy affidavit', sub: 'State of Florida, County of Miami-Dade' },
      received: '2026-09-15',
      blocks: [
        { type: 'para', text: 'I, Grace Kim, owner of 1530 Banyan Grove Lane, parcel 01-4103-021-0350, occupy the main house as my primary residence and will do so while the accessory dwelling unit is in use.' },
        { type: 'signature', name: 'Grace Kim', role: 'Affiant', date: '2026-09-12' },
        { type: 'notary', text: 'Sworn to and subscribed before me on 12 Sep 2026 by Grace Kim.', commission: 'HH 555124' },
      ],
    },
  ],
};

export const CHEN_PACKET: Packet = {
  caseId: 'MIA-2026-1149',
  documents: [
    {
      title: 'Permit application: rooftop solar',
      letterhead: { kind: 'city_form', org: 'City of Miami Building Department', sub: 'Permit application: rooftop solar', formNumber: 'Form BD-112 (2026)' },
      received: '2026-08-31',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Applicant and owner', value: 'Wei Chen' },
            { label: 'Property address', value: '2210 Seagrape Drive, Miami, FL 33133' },
            { label: 'Parcel', value: '01-3210-009-0270' },
            { label: 'Email', value: 'wei.chen@example.com' },
          ],
        },
        { type: 'heading', text: 'Scope of work' },
        { type: 'para', text: 'Rooftop solar photovoltaic array, 8.2 kW DC, 20 modules across two roof planes.' },
        { type: 'heading', text: 'Contractor' },
        {
          type: 'fields',
          items: [
            { label: 'Contractor', value: 'Meridian Solar Co.' },
            { label: 'Licence', value: 'EC13007777' },
            { label: 'Licence expires', value: '30 Nov 2027' },
          ],
        },
        { type: 'signature', name: 'Wei Chen', role: 'Owner', date: '2026-08-31' },
      ],
    },
    {
      title: 'Solar single-line diagram notes',
      letterhead: { kind: 'contractor', org: 'Meridian Solar Co.', sub: 'Solar design · EC13007777 · Sheet PV-2' },
      received: '2026-08-31',
      blocks: [
        { type: 'para', text: '2210 Seagrape Drive. Parcel 01-3210-009-0270. Owner: Wei Chen.' },
        { type: 'list', items: ['Main service panel: 200 A, with a 45 A solar backfeed breaker', 'Inverter: 7.6 kW AC, string type, exterior wall.', 'AC disconnect: lockable, exterior, beside the meter.'] },
        { type: 'drawing', drawing: { kind: 'single_line', panelRating: '200 A', backfeedBreaker: '45 A', inverter: '7.6 kW' }, caption: 'Single-line diagram' },
      ],
    },
    {
      title: 'Solar equipment spec sheets',
      letterhead: { kind: 'contractor', org: 'Meridian Solar Co.', sub: 'Solar design · EC13007777 · Sheet PV-3' },
      received: '2026-08-31',
      blocks: [{ type: 'list', items: ['Module: SunPeak SP-410M, 410 W. UL 61730 listed.', 'Inverter: VoltaLine VL-7600, 7.6 kW. UL 1741 listed.'] }],
    },
    {
      title: 'Roof plan',
      letterhead: { kind: 'contractor', org: 'Meridian Solar Co.', sub: 'Solar design · EC13007777 · Sheet PV-4' },
      received: '2026-08-31',
      blocks: [
        { type: 'drawing', drawing: { kind: 'roof_plan', pathway: '36"', ridgeSetback: '18"', modules: 20 }, caption: 'Roof plan, both planes' },
        { type: 'list', items: ['36 in pathway from eave to ridge on each roof plane.', 'Ridge setback: 18 in'] },
        { type: 'para', text: 'Structural attachment letter to follow under separate cover.' },
      ],
    },
    { missing: true, title: 'Wind load letter', criterion: 'S3' },
  ],
};

export const PATEL_PACKET: Packet = {
  caseId: 'MIA-2026-1163',
  documents: [
    {
      title: 'Combined application form',
      letterhead: { kind: 'city_form', org: 'City of Miami Building Department', sub: 'Combined permit application: accessory dwelling unit and rooftop solar', formNumber: 'Form BD-114 (2026)' },
      received: '2026-09-07',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Owner', value: 'Anika Patel' },
            { label: 'Address', value: '960 Tamarind Street, Miami, FL 33133' },
            { label: 'Parcel', value: '01-4105-033-0180' },
          ],
        },
        { type: 'para', text: 'Detached ADU of 700 sq ft in the rear yard, and a 5.6 kW rooftop solar array.' },
        { type: 'heading', text: 'Contractor' },
        {
          type: 'fields',
          items: [
            { label: 'Contractor', value: 'Keystone Electric and Solar LLC' },
            { label: 'Licence', value: 'EC13006666' },
            { label: 'Licence expires', value: '31 Aug 2026' },
          ],
        },
        { type: 'signature', name: 'Anika Patel', role: 'Owner', date: '2026-09-07' },
      ],
    },
    {
      title: 'ADU site plan notes',
      letterhead: { kind: 'contractor', org: 'Keystone Electric and Solar LLC', sub: 'EC13006666 · Sheet A-1' },
      received: '2026-09-07',
      blocks: [
        { type: 'drawing', drawing: { kind: 'site_plan', rearSetback: "6'-0\"", sideSetback: "6'-0\"", aduLabel: 'ADU 700 SF' }, caption: 'Site plan, not to scale' },
        { type: 'list', items: ['Zoning: T3-R. No existing accessory dwelling unit on the lot.', 'Rear setback: 6 ft 0 in', 'Side setback: 6 ft 0 in', 'ADU floor area: 700 sq ft'] },
      ],
    },
    {
      title: 'Boundary survey',
      letterhead: { kind: 'surveyor', org: 'Bayline Land Surveying, Inc.', sub: 'Professional surveyors and mappers · LB 5555' },
      received: '2026-09-07',
      blocks: [
        { type: 'para', text: 'Parcel 01-4105-033-0180. Owner: Anika Patel. 960 Tamarind Street.' },
        { type: 'para', text: 'Proposed ADU footprint is 6 ft 0 in from the rear and side lot lines.' },
        { type: 'drawing', drawing: { kind: 'survey', rearDistance: "6'-0\"", sideDistance: "6'-0\"" }, caption: 'Survey sketch, not to scale' },
        { type: 'seal', text: 'R. Ortega, PSM 5555, 2 Sep 2026' },
      ],
    },
    {
      title: 'Elevation certificate',
      letterhead: { kind: 'fema', org: 'Elevation certificate', sub: 'National Flood Insurance Program form, synthetic copy' },
      received: '2026-09-07',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Flood zone', value: 'AE' },
            { label: 'Base flood elevation', value: '7.5 ft NAVD' },
            { label: 'Lowest finished floor', value: '9.0 ft NAVD' },
          ],
        },
        { type: 'seal', text: 'R. Ortega, PSM 5555, 2 Sep 2026' },
      ],
    },
    {
      title: 'ADU electrical load calculation',
      letterhead: { kind: 'contractor', org: 'Keystone Electric and Solar LLC', sub: 'EC13006666 · Sheet E-1' },
      received: '2026-09-07',
      blocks: [{ type: 'para', text: 'New 60 A subpanel fed from the main panel. Added load: 40 A' }],
    },
    {
      title: 'Solar single-line diagram notes',
      letterhead: { kind: 'contractor', org: 'Keystone Electric and Solar LLC', sub: 'EC13006666 · Sheet PV-2' },
      received: '2026-09-07',
      blocks: [
        { type: 'list', items: ['Main service panel: 200 A, with a 30 A solar backfeed breaker', 'Inverter: 5.0 kW AC. AC disconnect: lockable, exterior.'] },
        { type: 'drawing', drawing: { kind: 'single_line', panelRating: '200 A', backfeedBreaker: '30 A', inverter: '5.0 kW', subpanel: '60 A' }, caption: 'Single-line diagram' },
      ],
    },
    {
      title: 'Solar equipment and structural',
      letterhead: { kind: 'contractor', org: 'Keystone Electric and Solar LLC', sub: 'EC13006666 · Sheet PV-3' },
      received: '2026-09-17',
      blocks: [
        { type: 'list', items: ['Module: SunPeak SP-400M, 400 W. UL 61730 listed.', 'Inverter: VoltaLine VL-5000, 5.0 kW. UL 1741 listed.'] },
        { type: 'para', text: 'Attachment design for the High-Velocity Hurricane Zone.' },
        { type: 'seal', text: 'Signed and sealed by A. Ferreira, PE 55501, 1 Sep 2026' },
        { type: 'drawing', drawing: { kind: 'roof_plan', pathway: '36"', ridgeSetback: '18"', modules: 14 }, caption: 'Roof plan, resubmitted 17 Sep 2026' },
        { type: 'list', items: ['36 in pathway from eave to ridge. Ridge setback: 18 in'] },
      ],
    },
    {
      title: 'Owner-occupancy affidavit',
      letterhead: { kind: 'affidavit', org: 'Owner-occupancy affidavit', sub: 'State of Florida, County of Miami-Dade' },
      received: '2026-09-07',
      blocks: [
        { type: 'para', text: 'I, Anika Patel, owner of parcel 01-4105-033-0180, occupy the main house as my primary residence.' },
        { type: 'signature', name: 'Anika Patel', role: 'Affiant', date: '2026-09-04' },
        { type: 'notary', text: 'Sworn to and subscribed before me on 4 Sep 2026.', commission: 'HH 555125' },
      ],
    },
  ],
};

export const NGUYEN_PACKET: Packet = {
  caseId: 'MIA-2026-1171',
  documents: [
    {
      title: 'Permit application: accessory dwelling unit',
      letterhead: { kind: 'city_form', org: 'City of Miami Building Department', sub: 'Permit application: accessory dwelling unit', formNumber: 'Form BD-113 (2026)' },
      received: '2026-09-03',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Owner', value: 'Thanh Nguyen' },
            { label: 'Address', value: '3345 Mango Hill Road, Miami, FL 33133' },
            { label: 'Parcel', value: '01-4107-012-0090' },
          ],
        },
        { type: 'heading', text: 'Scope of work' },
        { type: 'para', text: 'Detached ADU of 860 sq ft in the rear yard. A variance from the 800 sq ft limit is requested.' },
        { type: 'heading', text: 'Contractor' },
        {
          type: 'fields',
          items: [
            { label: 'Contractor', value: 'Coral Ridge Construction Inc.' },
            { label: 'Licence', value: 'CGC1544444' },
            { label: 'Licence expires', value: '31 Aug 2027' },
          ],
        },
        { type: 'signature', name: 'Thanh Nguyen', role: 'Owner', date: '2026-09-03' },
      ],
    },
    {
      title: 'Variance request letter',
      letterhead: { kind: 'letter', org: 'Thanh Nguyen', sub: '3345 Mango Hill Road, Miami, FL 33133' },
      received: '2026-09-03',
      blocks: [
        { type: 'para', text: 'I request a variance from the 800 sq ft limit for an ADU of 860 sq ft. The extra 60 sq ft gives my mother, who uses a wheelchair, an accessible bathroom and bedroom.' },
        { type: 'signature', name: 'Thanh Nguyen', role: 'Owner', date: '2026-09-03' },
      ],
    },
    {
      title: 'ADU site plan notes',
      letterhead: { kind: 'contractor', org: 'Coral Ridge Construction Inc.', sub: 'CGC1544444 · Sheet A-1' },
      received: '2026-09-03',
      blocks: [
        { type: 'drawing', drawing: { kind: 'site_plan', rearSetback: "8'-0\"", sideSetback: "6'-0\"", aduLabel: 'ADU 860 SF' }, caption: 'Site plan, not to scale' },
        { type: 'list', items: ['Zoning: T3-R. No existing accessory dwelling unit on the lot.', 'Rear setback: 8 ft 0 in', 'Side setback: 6 ft 0 in', 'ADU floor area: 860 sq ft'] },
      ],
    },
    {
      title: 'Boundary survey',
      letterhead: { kind: 'surveyor', org: 'Bayline Land Surveying, Inc.', sub: 'Professional surveyors and mappers · LB 5555' },
      received: '2026-09-03',
      blocks: [
        { type: 'para', text: 'Parcel 01-4107-012-0090. Owner: Thanh Nguyen. 3345 Mango Hill Road.' },
        { type: 'para', text: 'Proposed ADU footprint is 8 ft 0 in from the rear lot line and 6 ft 0 in from the side.' },
        { type: 'drawing', drawing: { kind: 'survey', rearDistance: "8'-0\"", sideDistance: "6'-0\"" }, caption: 'Survey sketch, not to scale' },
        { type: 'seal', text: 'R. Ortega, PSM 5555, 28 Aug 2026' },
      ],
    },
    {
      title: 'Elevation certificate',
      letterhead: { kind: 'fema', org: 'Elevation certificate', sub: 'National Flood Insurance Program form, synthetic copy' },
      received: '2026-09-03',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Flood zone', value: 'AE' },
            { label: 'Base flood elevation', value: '7.0 ft NAVD' },
            { label: 'Lowest finished floor', value: '8.4 ft NAVD' },
          ],
        },
        { type: 'seal', text: 'R. Ortega, PSM 5555, 28 Aug 2026' },
      ],
    },
    {
      title: 'Owner-occupancy affidavit',
      letterhead: { kind: 'affidavit', org: 'Owner-occupancy affidavit', sub: 'State of Florida, County of Miami-Dade' },
      received: '2026-09-03',
      blocks: [
        { type: 'para', text: 'I, Thanh Nguyen, owner of parcel 01-4107-012-0090, occupy the main house as my primary residence.' },
        { type: 'signature', name: 'Thanh Nguyen', role: 'Affiant', date: '2026-09-01' },
        { type: 'notary', text: 'Sworn to and subscribed before me on 1 Sep 2026.', commission: 'HH 555126' },
      ],
    },
  ],
};

export const BROOKS_PACKET: Packet = {
  caseId: 'MIA-2026-1178',
  documents: [
    {
      title: 'Permit application: rooftop solar',
      letterhead: { kind: 'city_form', org: 'City of Miami Building Department', sub: 'Permit application: rooftop solar', formNumber: 'Form BD-112 (2026)' },
      received: '2026-08-25',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Applicant and owner', value: 'Denise Brooks' },
            { label: 'Property address', value: '5120 Ibis Landing Court, Miami, FL 33143' },
            { label: 'Parcel', value: '01-3115-050-0210' },
            { label: 'Email', value: 'denise.brooks@example.com' },
          ],
        },
        { type: 'heading', text: 'Scope of work' },
        { type: 'para', text: 'Rooftop solar photovoltaic array, 7.0 kW DC, 17 modules on the south roof plane.' },
        { type: 'heading', text: 'Contractor' },
        {
          type: 'fields',
          items: [
            { label: 'Contractor', value: 'Gulfstream Solar LLC' },
            { label: 'Licence', value: 'EC13005555' },
            { label: 'Licence expires', value: '28 Feb 2028' },
          ],
        },
        { type: 'signature', name: 'Denise Brooks', role: 'Owner', date: '2026-08-25' },
      ],
    },
    {
      title: 'Solar single-line diagram notes',
      letterhead: { kind: 'contractor', org: 'Gulfstream Solar LLC', sub: 'Solar design · EC13005555 · Sheet PV-2' },
      received: '2026-08-25',
      blocks: [
        { type: 'para', text: '5120 Ibis Landing Court. Parcel 01-3115-050-0210. Owner: Denise Brooks.' },
        { type: 'list', items: ['Main service panel: 200 A, with a 35 A solar backfeed breaker', 'Inverter: 6.0 kW AC, string type. AC disconnect: lockable, exterior.'] },
        { type: 'drawing', drawing: { kind: 'single_line', panelRating: '200 A', backfeedBreaker: '35 A', inverter: '6.0 kW' }, caption: 'Single-line diagram' },
      ],
    },
    {
      title: 'Roof plan',
      letterhead: { kind: 'contractor', org: 'Gulfstream Solar LLC', sub: 'Solar design · EC13005555 · Sheet PV-3' },
      received: '2026-08-25',
      blocks: [
        { type: 'drawing', drawing: { kind: 'roof_plan', pathway: '36"', ridgeSetback: '18"', modules: 17 }, caption: 'Roof plan, south plane' },
        { type: 'list', items: ['36 in pathway from eave to ridge on the west side of the array.', 'Ridge setback: 18 in'] },
      ],
    },
    {
      title: 'Installer notes',
      letterhead: { kind: 'contractor', org: 'Gulfstream Solar LLC', sub: 'Field notes · EC13005555' },
      received: '2026-08-25',
      blocks: [{ type: 'para', text: 'Modules run to 14 in below the ridge to fit the third string. Rail layout otherwise per the roof plan.' }],
    },
    {
      title: 'Solar equipment and structural',
      letterhead: { kind: 'contractor', org: 'Gulfstream Solar LLC', sub: 'Solar design · EC13005555 · Sheet PV-4' },
      received: '2026-08-25',
      blocks: [
        { type: 'list', items: ['Module: SunPeak SP-410M, 410 W. UL 61730 listed.', 'Inverter: VoltaLine VL-6000, 6.0 kW. UL 1741 listed.'] },
        { type: 'para', text: 'Attachment design for the High-Velocity Hurricane Zone.' },
        { type: 'seal', text: 'Signed and sealed by M. Oduya, PE 55502, 20 Aug 2026' },
      ],
    },
  ],
};
