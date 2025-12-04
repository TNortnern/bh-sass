/**
 * Default contract templates for the bounce house rental system
 * These are seeded into the database as platform-wide defaults
 */

export const defaultTemplates = [
  {
    name: 'Standard Rental Agreement',
    templateType: 'rental-agreement',
    description: 'Standard rental agreement for bounce house rentals',
    isDefault: true,
    requiresSignature: true,
    isActive: true,
    content: {
      root: {
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'RENTAL AGREEMENT' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'This Rental Agreement ("Agreement") is entered into on {{currentDate}} between {{tenantName}} ("Lessor") located at {{tenantAddress}}, and {{customerName}} ("Lessee") located at {{customerAddress}}.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '1. RENTAL ITEM' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Lessor agrees to rent to Lessee the following item: {{itemName}} ({{itemCategory}}).',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '2. RENTAL PERIOD' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'The rental period begins on {{startDate}} and ends on {{endDate}}. The item will be delivered to {{deliveryAddress}}.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '3. PAYMENT TERMS' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Total rental fee: ${{totalPrice}}. Deposit paid: ${{depositPaid}}. Balance due: ${{balanceDue}}. Full payment is due prior to or on the day of delivery unless otherwise arranged.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '4. LESSEE RESPONSIBILITIES' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Lessee agrees to: (a) Supervise the use of the rental item at all times; (b) Follow all safety guidelines and manufacturer recommendations; (c) Not exceed the maximum capacity or weight limits; (d) Keep the rental item clean and free from damage; (e) Notify Lessor immediately of any damage or malfunction.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '5. LIABILITY AND INSURANCE' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Lessee assumes full responsibility for the rental item during the rental period and agrees to return it in the same condition as received, normal wear and tear excepted. Lessee is responsible for any damage, loss, or theft of the equipment.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '6. CANCELLATION POLICY' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Cancellations must be made at least 48 hours in advance for a full refund of the deposit. Cancellations made less than 48 hours before the rental period will forfeit 50% of the deposit. No refunds for cancellations made less than 24 hours before delivery.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '7. WEATHER POLICY' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'In the event of severe weather (high winds, thunderstorms, etc.), Lessor reserves the right to cancel or reschedule the rental for safety reasons. A full refund or reschedule will be provided in such cases.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'By signing below, both parties acknowledge they have read, understood, and agree to the terms of this Agreement.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'Liability Waiver',
    templateType: 'liability-waiver',
    description: 'Standard liability waiver for bounce house rentals',
    isDefault: true,
    requiresSignature: true,
    isActive: true,
    content: {
      root: {
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'LIABILITY WAIVER AND RELEASE' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'I, {{customerName}}, hereby rent the following inflatable equipment from {{tenantName}}: {{itemName}}.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'ASSUMPTION OF RISK' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'I acknowledge that the use of inflatable equipment involves inherent risks including, but not limited to, the risk of physical injury. I voluntarily assume all risks associated with the use of this equipment.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'RELEASE OF LIABILITY' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'I hereby release, waive, and discharge {{tenantName}}, its owners, employees, and agents from any and all liability, claims, demands, or causes of action arising from personal injury, property damage, or wrongful death that may result from the use of the rental equipment.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'INDEMNIFICATION' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'I agree to indemnify and hold harmless {{tenantName}} from any loss, liability, damage, or costs that may arise from my use of the equipment or any claims made by third parties.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'SUPERVISION' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'I understand that adult supervision is required at all times during the use of the equipment. I agree to ensure proper supervision and adherence to all safety guidelines.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'I have read this waiver and release, fully understand its terms, and sign it freely and voluntarily without any inducement.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'Damage Policy',
    templateType: 'damage-policy',
    description: 'Policy regarding damage to rental equipment',
    isDefault: true,
    requiresSignature: true,
    isActive: true,
    content: {
      root: {
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'DAMAGE POLICY' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Customer: {{customerName}} | Rental Item: {{itemName}} | Rental Date: {{startDate}}',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '1. NORMAL WEAR AND TEAR' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Minor wear and tear resulting from normal use is expected and will not result in additional charges. This includes minor scuffs, dirt, or grass stains that can be cleaned.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '2. EXCESSIVE DAMAGE' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Customer is responsible for any damage beyond normal wear and tear, including but not limited to: tears, holes, burns, permanent stains, broken zippers, damaged blowers, or structural damage.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '3. PROHIBITED ACTIVITIES' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'The following are strictly prohibited and may result in damage charges: silly string, confetti, paint, markers, food coloring, sharp objects, shoes (unless specifically allowed), pets, and exceeding weight or capacity limits.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '4. DAMAGE FEES' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Small tears or holes: $25-$100 depending on size and location. Large tears requiring panel replacement: $100-$500. Complete unit replacement: Full retail value of equipment. Blower damage or replacement: $150-$300.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '5. INSPECTION' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Equipment will be inspected upon pickup. Customer will be notified of any damage and associated costs within 48 hours. Charges will be billed to the payment method on file.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'I acknowledge that I have read and understand the damage policy and agree to be responsible for any damage charges that may occur.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'Safety Rules Acknowledgment',
    templateType: 'safety-rules',
    description: 'Safety guidelines and rules for bounce house use',
    isDefault: true,
    requiresSignature: true,
    isActive: true,
    content: {
      root: {
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'SAFETY RULES AND GUIDELINES' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Customer: {{customerName}} | Equipment: {{itemName}} | Event Date: {{startDate}}',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'GENERAL SAFETY RULES' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: '1. Adult supervision is required at all times.\n2. Remove shoes, glasses, jewelry, and sharp objects before entering.\n3. Do not exceed the maximum capacity or weight limit.\n4. No flips, rough play, or dangerous activities.\n5. Enter and exit carefully using designated entrance/exit.\n6. No food, drinks, or gum inside the inflatable.\n7. Keep inflatable clean and dry.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'WEATHER RESTRICTIONS' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Do not use the inflatable during: winds exceeding 15 mph, thunderstorms or lightning, heavy rain, or any severe weather conditions. Immediately evacuate and turn off blower if weather conditions deteriorate.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'AGE AND SIZE RESTRICTIONS' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Separate users by age and size groups. Do not allow significantly different sized children to jump together. Follow the age recommendations specific to this equipment.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'PROHIBITED ITEMS' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'The following items are strictly prohibited: silly string, confetti, markers, paints, sharp objects, pets, bicycles, skateboards, and any items that could puncture or damage the inflatable.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: 'BLOWER OPERATION' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'The blower must remain on at all times during use. Do not cover or obstruct the blower. Keep the blower away from water. Do not unplug or turn off the blower while people are inside.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'I acknowledge that I have read, understood, and will follow all safety rules and guidelines. I will ensure all users are informed of these rules.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'Weather Cancellation Policy',
    templateType: 'weather-policy',
    description: 'Policy for weather-related cancellations and rescheduling',
    isDefault: true,
    requiresSignature: false,
    isActive: true,
    content: {
      root: {
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'WEATHER CANCELLATION POLICY' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Booking for: {{customerName}} | Item: {{itemName}} | Date: {{startDate}}',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '1. SAFETY FIRST' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: '{{tenantName}} reserves the right to cancel or delay delivery/setup in the event of unsafe weather conditions, including but not limited to high winds, thunderstorms, heavy rain, or other severe weather.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '2. WEATHER CONDITIONS REQUIRING CANCELLATION' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Winds exceeding 15 mph sustained or 20 mph gusts\nActive thunderstorms or lightning within 10 miles\nFlood warnings or heavy rain\nExtreme temperature conditions\nAny weather deemed unsafe by our staff',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '3. COMPANY-INITIATED CANCELLATION' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'If {{tenantName}} cancels due to weather before delivery, customer will receive: (a) Full refund of all payments, OR (b) Option to reschedule to any available date within 6 months with no additional fees.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '4. CUSTOMER-INITIATED CANCELLATION' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'If customer cancels due to weather concerns: (a) More than 24 hours before delivery: Full refund or free reschedule, (b) Less than 24 hours before delivery: 50% refund or free reschedule, (c) After delivery has begun: No refund, but may receive credit toward future rental.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '5. DURING-EVENT WEATHER' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'If severe weather develops during the rental period, customer must immediately evacuate the inflatable and turn off the blower. If weather prevents use for more than 50% of the rental period, a partial refund or credit may be issued at our discretion.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ type: 'text', text: '6. RESCHEDULING' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Weather-related rescheduling is subject to availability. We will make every effort to accommodate your preferred date. Rescheduled bookings must be used within 6 months of original rental date.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Contact us at {{tenantPhone}} or {{tenantEmail}} with any weather-related questions or concerns.',
              },
            ],
          },
        ],
      },
    },
  },
]
