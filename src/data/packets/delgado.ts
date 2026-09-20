import type { Packet } from '@/data/types';

/**
 * Hero case. Seven plain-text documents under 450 words in total. Every quoted
 * phrase from the spec appears literally so exact-string highlighting works.
 * The elevation certificate is absent on purpose.
 */
export const DELGADO_PACKET: Packet = {
  caseId: 'MIA-2026-1187',
  documents: [
    {
      title: 'Combined application form',
      letterhead: { kind: 'city_form', org: 'City of Miami Building Department', sub: 'Combined permit application: accessory dwelling unit and rooftop solar', formNumber: 'Form BD-114 (2026)' },
      received: '2026-09-21',
      blocks: [
        {
          type: 'fields',
          items: [
            { label: 'Applicant and owner', value: 'Maria Delgado' },
            { label: 'Property address', value: '412 Palmetto Court, Miami, FL 33133' },
            { label: 'Parcel', value: '01-4102-018-0420' },
            { label: 'Zoning district', value: 'T3-R' },
            { label: 'Preferred language', value: 'Spanish' },
            { label: 'Email', value: 'maria.delgado@example.com' },
            { label: 'Mobile', value: '(305) 555-0142' },
          ],
        },
        { type: 'heading', text: 'Scope of work' },
        { type: 'para', text: 'Detached accessory dwelling unit of 640 sq ft in the rear yard, and a 7.2 kW rooftop solar array on the main house.' },
        { type: 'heading', text: 'Contractor' },
        {
          type: 'fields',
          items: [
            { label: 'Contractor', value: 'Sunward Electric LLC' },
            { label: 'Licence', value: 'EC13009999' },
            { label: 'Licence expires', value: '31 Aug 2027' },
          ],
        },
        { type: 'signature', name: 'Maria Delgado', role: 'Owner', date: '2026-09-21' },
      ],
    },
    {
      title: 'ADU site plan notes',
      letterhead: { kind: 'contractor', org: 'Sunward Electric LLC', sub: 'Design and build · EC13009999 · Sheet A-1' },
      received: '2026-09-21',
      blocks: [
        { type: 'heading', text: 'Sheet A-1. ADU site plan' },
        { type: 'drawing', drawing: { kind: 'site_plan', rearSetback: "5'-0\"", sideSetback: "5'-6\"", aduLabel: 'ADU 640 SF' }, caption: 'Site plan, not to scale' },
        {
          type: 'list',
          items: [
            'Zoning: T3-R. No existing accessory dwelling unit on the lot.',
            'Rear setback: 5 ft 0 in',
            'Side setback: 5 ft 6 in',
            'ADU floor area: 640 sq ft',
            'Detached, single storey, slab on grade.',
          ],
        },
      ],
    },
    {
      title: 'Boundary survey',
      letterhead: { kind: 'surveyor', org: 'Bayline Land Surveying, Inc.', sub: 'Professional surveyors and mappers · LB 5555' },
      received: '2026-09-21',
      blocks: [
        { type: 'heading', text: 'Boundary survey with proposed improvements' },
        { type: 'para', text: 'Parcel 01-4102-018-0420. Owner: Maria Delgado. 412 Palmetto Court.' },
        { type: 'para', text: 'Proposed ADU footprint is 4 ft 6 in from the rear lot line and 5 ft 6 in from the east side lot line.' },
        { type: 'drawing', drawing: { kind: 'survey', rearDistance: "4'-6\"", sideDistance: "5'-6\"" }, caption: 'Survey sketch, not to scale' },
        { type: 'para', text: 'Field work completed 3 Sep 2026. Bearings from the recorded plat.' },
        { type: 'seal', text: 'Signed and sealed by R. Ortega, PSM 5555, 5 Sep 2026' },
      ],
    },
    { missing: true, title: 'Elevation certificate', criterion: 'A5' },
    {
      title: 'ADU electrical load calculation',
      letterhead: { kind: 'contractor', org: 'Sunward Electric LLC', sub: 'Design and build · EC13009999 · Sheet E-1' },
      received: '2026-09-21',
      blocks: [
        { type: 'heading', text: 'ADU electrical load calculation' },
        { type: 'para', text: 'New 60 A subpanel fed from the main panel. Added load: 48 A' },
        {
          type: 'fields',
          items: [
            { label: 'Lighting and receptacles', value: '12 A' },
            { label: 'Kitchen circuits', value: '16 A' },
            { label: 'Mini-split heat pump', value: '14 A' },
            { label: 'Water heater', value: '6 A' },
          ],
        },
        { type: 'para', text: 'No service upgrade is included in this scope.' },
      ],
    },
    {
      title: 'Solar single-line diagram notes',
      letterhead: { kind: 'contractor', org: 'Sunward Electric LLC', sub: 'Design and build · EC13009999 · Sheet PV-2' },
      received: '2026-09-21',
      blocks: [
        { type: 'heading', text: 'Single-line diagram notes' },
        {
          type: 'list',
          items: [
            'Main service panel: 150 A, with a 40 A solar backfeed breaker',
            'Array: 18 modules, 7.2 kW DC, two strings.',
            'Inverter: 6.0 kW AC, string type, wall mounted in the garage.',
            'AC disconnect: lockable, exterior, within sight of the meter.',
          ],
        },
        { type: 'drawing', drawing: { kind: 'single_line', panelRating: '150 A', backfeedBreaker: '40 A', inverter: '6.0 kW', subpanel: '60 A' }, caption: 'Single-line diagram' },
      ],
    },
    {
      title: 'Solar equipment and structural',
      letterhead: { kind: 'contractor', org: 'Sunward Electric LLC', sub: 'Design and build · EC13009999 · Sheet PV-3' },
      received: '2026-09-21',
      blocks: [
        { type: 'heading', text: 'Equipment specification sheets' },
        {
          type: 'list',
          items: ['Module: SunPeak SP-400M, 400 W. UL 61730 listed.', 'Inverter: VoltaLine VL-6000, 6.0 kW. UL 1741 listed.'],
        },
        { type: 'heading', text: 'Wind load letter' },
        { type: 'para', text: 'Attachment design for the High-Velocity Hurricane Zone, 175 mph design wind speed.' },
        { type: 'seal', text: 'Signed and sealed by A. Ferreira, PE 55501, 8 Sep 2026' },
        { type: 'heading', text: 'Roof plan' },
        { type: 'drawing', drawing: { kind: 'roof_plan', pathway: '36"', ridgeSetback: '18"', modules: 18 }, caption: 'Roof plan, main house' },
        {
          type: 'list',
          items: ['36 in pathway from eave to ridge on the west side of the array.', 'Ridge setback: 18 in'],
        },
      ],
    },
    {
      title: 'Owner-occupancy affidavit',
      letterhead: { kind: 'affidavit', org: 'Owner-occupancy affidavit', sub: 'State of Florida, County of Miami-Dade' },
      received: '2026-09-21',
      blocks: [
        { type: 'para', text: 'I, Maria Delgado, owner of 412 Palmetto Court, parcel 01-4102-018-0420, affirm that I occupy the main house as my primary residence and will continue to do so while the accessory dwelling unit is in use.' },
        { type: 'signature', name: 'Maria Delgado', role: 'Affiant', date: '2026-09-19' },
        { type: 'notary', text: 'Sworn to and subscribed before me on 19 Sep 2026 by Maria Delgado, who is personally known to me.', commission: 'HH 555123' },
      ],
    },
  ],
};
