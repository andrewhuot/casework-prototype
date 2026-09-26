import type { Source } from './types';

export const SOURCES: Source[] = [
  {
    id: 'R1',
    name: 'Zoning code: accessory dwelling units (excerpt)',
    type: 'regulation',
    added: '2026-02-03',
    usedFor: ['A1', 'A2', 'A3', 'A4'],
    heading: 'Chapter 7, Article 3. Accessory dwelling units',
    sections: [
      { label: '§ADU-1', text: 'Eligibility. One accessory dwelling unit is permitted on a lot in the T3 and T4 transect zones that contains one principal single-family residence. No more than one accessory dwelling unit may exist on a lot.' },
      { label: '§ADU-2', text: 'Unit size. The floor area of an accessory dwelling unit shall not exceed 800 square feet, measured to the exterior face of the walls.' },
      { label: '§ADU-3', text: 'Setbacks. A detached accessory dwelling unit shall be set back at least 5 feet from the side and rear lot lines. An administrative waiver of up to 1 foot may be requested where the affected neighbouring owner consents in writing.' },
      { label: '§ADU-4', text: 'Parking. No additional parking space is required for an accessory dwelling unit.' },
      { label: '§ADU-5', text: 'Owner occupancy. The owner shall occupy either the principal residence or the accessory dwelling unit. A notarised owner-occupancy affidavit shall be filed with the application and recorded before a certificate of occupancy is issued.' },
    ],
  },
  {
    id: 'R2',
    name: 'Florida Building Code: rooftop solar (excerpt)',
    type: 'regulation',
    added: '2026-02-03',
    usedFor: ['S2', 'S3', 'S4', 'S5'],
    heading: 'Section RS. Rooftop photovoltaic systems on one- and two-family dwellings',
    sections: [
      { label: '§RS-1', text: 'Scope. This section applies to roof-mounted photovoltaic systems on one- and two-family dwellings.' },
      { label: '§RS-2', text: 'Fire classification. Modules shall be listed with the roof assembly for the fire class required for the roof.' },
      { label: '§RS-3', text: 'Roof access pathways. A pathway not less than 36 inches wide shall be provided from the eave to the ridge on each roof plane that carries modules. Modules shall be set back not less than 18 inches from the ridge on both sides of the ridge.' },
      { label: '§RS-4', text: 'Loads. Roof structure shall carry the dead load of the array in addition to the design loads for the roof.' },
      { label: '§RS-5', text: 'Wind load. In the High-Velocity Hurricane Zone, module attachment shall be designed for the design wind speed at the site, and the design shall be signed and sealed by a Florida-registered engineer.' },
      { label: '§RS-6', text: 'Electrical diagram. The permit set shall include a single-line diagram that shows the array, the inverter, the AC disconnect, and the rating of the main service panel and of the backfeed breaker.' },
      { label: '§RS-7', text: 'Equipment listing. Modules shall be listed to UL 61730 and inverters to UL 1741. The listing shall be stated on the specification sheet submitted with the application.' },
    ],
  },
  {
    id: 'R3',
    name: 'Floodplain ordinance (excerpt)',
    type: 'regulation',
    added: '2026-02-10',
    usedFor: ['A5'],
    heading: 'Chapter 11. Flood damage prevention',
    sections: [
      { label: '§FP-1', text: 'Applicability. This chapter applies to new construction and substantial improvements within a special flood hazard area.' },
      { label: '§FP-2', text: 'Elevation certificate. An elevation certificate on the current FEMA form, completed by a licensed surveyor or engineer, shall be submitted with the permit application for any new habitable structure.' },
      { label: '§FP-3', text: 'Base flood elevation. The base flood elevation is taken from the flood insurance rate map in effect on the date of application.' },
      { label: '§FP-4', text: 'Finished floor. The lowest finished floor of new residential construction, including an accessory dwelling unit, shall be at least 1 foot above the base flood elevation, as shown on the elevation certificate.' },
    ],
  },
  {
    id: 'R4',
    name: 'Building Department plan review checklist, 2026',
    type: 'internal_manual',
    added: '2026-03-02',
    usedFor: ['S1', 'X1', 'X2'],
    heading: 'Residential plan review checklist, 2026 edition',
    sections: [
      { label: 'Item 1', text: 'Consistency. Confirm that the owner, the parcel number, and the property address match across the application form and every attached document.' },
      { label: 'Item 2', text: 'Contractor licence. Record the Florida licence number for each contractor and check that the expiry date is after the application date.' },
      { label: 'Item 3', text: 'Scope. Confirm that the scope of work on the application matches the drawings.' },
      { label: 'Item 4', text: 'Fees. Confirm that plan review fees are paid before review begins.' },
      { label: 'Item 5', text: 'Site plan. Confirm setbacks and lot coverage against the zoning code.' },
      { label: 'Item 6', text: 'Structural. Route to structural review where the scope requires it.' },
      { label: 'Item 7', text: 'Flood. Confirm the elevation certificate where the parcel lies in a flood zone.' },
      { label: 'Item 8', text: 'Fire. Confirm roof access pathways for rooftop equipment.' },
      { label: 'Item 9', text: 'Electrical capacity. Where one application adds load and generation together, check both sheets against one panel. The main breaker must carry the combined calculated load, and the main breaker plus the backfeed breaker must stay within 120 percent of the busbar rating. A main breaker derated to fit solar must still carry the new load. Otherwise a panel upgrade must be included in the scope of work.' },
    ],
  },
  {
    id: 'R5',
    name: 'Closed cases 2024 to 2025 (a sample of 1,200 decisions)',
    type: 'prior_decisions',
    added: '2026-03-16',
    usedFor: 'precedents',
    sections: [],
  },
  {
    id: 'R6',
    name: 'Fire Marshal bulletin 2026-03: rooftop access pathways',
    type: 'regulation',
    added: '2026-09-21',
    usedFor: ['S2'],
    heading: 'Fire Marshal bulletin 2026-03. Rooftop access pathways for photovoltaic arrays',
    link: 'https://example.com/fire-marshal/bulletins/2026-03',
    hiddenOnLoad: true,
    sections: [
      { label: '§1', text: 'Purpose. This bulletin updates the ridge setback guidance for rooftop photovoltaic arrays following the 2025 review of roof ventilation during structure fires.' },
      { label: '§2', text: 'Ridge setback. A pathway not less than 36 inches wide shall be provided from the eave to the ridge. The ridge setback shall be 18 inches, or 36 inches where the array covers more than 33 percent of the roof plane, so that crews can open the roof for ventilation.' },
      { label: '§3', text: 'Effect. This bulletin applies to applications filed on or after its adoption by the Building Department. Applications already filed are reviewed under the rules in effect on their filing date.' },
    ],
  },
];

export const SOURCES_BY_ID: Record<string, Source> = Object.fromEntries(SOURCES.map((s) => [s.id, s]));

/** The passage in R6 that the proposed S2 change quotes. */
export const R6_QUOTE_SECTION = '§2';
