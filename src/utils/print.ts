import { Booking, CateringItem } from '../types';

const generateMenuHTML = (selectedNames: string[], cateringItems?: CateringItem[]) => {
  if (!selectedNames || selectedNames.length === 0) return '';

  // If we don't have cateringItems reference, just list the selected names in a simple grid
  if (!cateringItems || cateringItems.length === 0) {
    return `
      <div class="section-title" style="font-size: 14px; font-weight: bold; border-bottom: 1px solid #1a1b22; margin-top: 25px; margin-bottom: 10px; text-transform: uppercase;">Selected Catering Inclusions</div>
      <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 20px;">
        ${selectedNames.map(name => `
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #006c49; font-weight: bold;">✓</span> ${name}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Filter selected items from catalog
  const selectedCatering = cateringItems.filter(item => selectedNames.includes(item.name));
  
  // Also collect any item that might not match the current catalogue exactly (e.g. customized items)
  selectedNames.forEach(name => {
    if (!selectedCatering.some(i => i.name === name)) {
      selectedCatering.push({
        id: name,
        name: name,
        category: 'Other Inclusions',
        description: '',
        price: 0,
        isAvailable: true,
        image: ''
      });
    }
  });

  // Group by category
  const grouped: { [category: string]: string[] } = {};
  selectedCatering.forEach(item => {
    const cat = item.category || 'Other Inclusions';
    if (!grouped[cat]) {
      grouped[cat] = [];
    }
    grouped[cat].push(item.name);
  });

  return `
    <div style="font-size: 14px; font-weight: bold; border-bottom: 1px solid #1a1b22; margin-top: 25px; margin-bottom: 12px; text-transform: uppercase;">Catering Menu & Selected Inclusions</div>
    <div style="display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 25px; page-break-inside: avoid;">
      ${Object.entries(grouped).map(([category, items]) => `
        <div style="border: 1px solid #e3e1eb; padding: 10px; border-radius: 8px; background-color: #fcfbfe; break-inside: avoid;">
          <strong style="color: #00288e; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 6px; border-bottom: 1px solid #eeedf7; padding-bottom: 3px;">${category}</strong>
          <ul style="list-style-type: none; padding-left: 0; margin: 0;">
            ${items.map(item => `
              <li style="margin-bottom: 4px; color: #1a1b22; display: flex; align-items: flex-start; gap: 5px; line-height: 1.3;">
                <span style="color: #006c49; font-weight: bold; font-size: 13px; line-height: 1;">✓</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;
};

export const printInvoice = (book: Booking, cateringItems?: CateringItem[], venueName?: string) => {
  const finalVenueName = venueName || localStorage.getItem('tenantName') || 'My Banquet';
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const menuHTML = generateMenuHTML(book.menuSelection, cateringItems);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${book.customerName}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1a1b22; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eeedf7; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #00288e; }
        .invoice-title { font-size: 28px; font-weight: 800; color: #1a1b22; text-align: right; }
        .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .meta-card { padding: 15px; border: 1px solid #e3e1eb; border-radius: 12px; background-color: rgba(244, 242, 252, 0.2); }
        .meta-card h3 { margin-top: 0; color: #00288e; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .meta-card p { margin: 6px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th { background-color: #f4f2fc; color: #00288e; padding: 12px; text-align: left; font-size: 13px; font-weight: bold; border-bottom: 2px solid #e3e1eb; }
        td { padding: 12px; font-size: 14px; border-bottom: 1px solid #eeedf7; }
        .totals-table { width: 40%; margin-left: auto; margin-right: 0; }
        .totals-table td { border-bottom: none; padding: 8px 12px; }
        .totals-table tr.grand-total td { font-weight: bold; color: #00288e; font-size: 16px; border-top: 2px solid #e3e1eb; padding-top: 12px; }
        .footer { text-align: center; margin-top: 60px; font-size: 11px; color: #444653; border-top: 1px solid #e3e1eb; padding-top: 20px; }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">${finalVenueName}</div>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #444653;">Premium Celebration Spaces</p>
        </div>
        <div>
          <div class="invoice-title">INVOICE</div>
          <p style="margin: 5px 0 0 0; font-size: 12px; text-align: right; color: #444653;">Invoice No: INV-${book.id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <h3>Billed To (Client Details)</h3>
          <p><strong>Name:</strong> ${book.customerName}</p>
          <p><strong>Phone:</strong> ${book.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${book.email || 'N/A'}</p>
        </div>
        <div class="meta-card">
          <h3>Event Specification</h3>
          ${book.allocations && book.allocations.length > 0 ? `
            <div style="font-size: 11px; line-height: 1.4;">
              ${book.allocations.map((alloc, idx) => `
                <div style="margin-bottom: 5px; border-bottom: 1px dashed #eeedf7; padding-bottom: 3px;">
                  <strong>Event #${idx + 1}:</strong> ${alloc.venue}<br/>
                  <strong>Date:</strong> ${alloc.eventDate} | <strong>Slot:</strong> ${alloc.timeSlot} (${alloc.startTime || '10:00'})
                </div>
              `).join('')}
            </div>
            <p style="margin: 5px 0 0 0; font-size: 11px;"><strong>Guests Expected:</strong> ${book.pax || 150} Pax</p>
          ` : `
            <p><strong>Venue Space:</strong> ${book.venue}</p>
            <p><strong>Event Date:</strong> ${book.eventDate}</p>
            <p><strong>Guests Expected:</strong> ${book.pax || 150} Pax</p>
            ${book.timeSlot ? `<p><strong>Time Slot:</strong> ${book.timeSlot === 'Morning' ? 'Day Slot (10 AM - 4 PM)' : 'Night Slot (7 PM - 1 AM)'}</p>` : ''}
            ${book.startTime ? `<p><strong>Start Time:</strong> ${book.startTime}</p>` : ''}
          `}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Venue Reservation & Catering Package Inclusions</td>
            <td style="text-align: right;">₹${book.totalAmount.toLocaleString('en-IN')}</td>
            <td style="text-align: right;">₹${book.totalAmount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      ${menuHTML}

      <table class="totals-table">
        <tbody>
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">₹${book.totalAmount.toLocaleString('en-IN')}</td>
          </tr>
          ${book.discountPercent ? `
          <tr style="color: #006c49;">
            <td>Discount (${book.discountPercent}%):</td>
            <td style="text-align: right;">-₹${book.discountAmount.toLocaleString('en-IN')}</td>
          </tr>
          ` : ''}
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td style="text-align: right;">₹${(book.finalAmount || book.totalAmount).toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="color: #006c49; font-weight: 600;">Amount Received:</td>
            <td style="text-align: right; color: #006c49; font-weight: 600;">₹${book.amountReceived.toLocaleString('en-IN')}</td>
          </tr>
          <tr style="border-top: 1px solid #eeedf7;">
            <td style="color: #ba1a1a; font-weight: bold;">Outstanding Balance:</td>
            <td style="text-align: right; color: #ba1a1a; font-weight: bold;">₹${book.pendingBalance.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 50px;">
        <h4 style="color: #00288e; margin-bottom: 10px; font-size: 14px;">Payment Status Summary</h4>
        <div style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; background-color: ${book.pendingBalance === 0 ? '#d1e7dd' : '#f8d7da'}; color: ${book.pendingBalance === 0 ? '#0f5132' : '#842029'};">
          ${book.pendingBalance === 0 ? 'FULLY PAID' : 'PARTIALLY PAID - BALANCE PENDING'}
        </div>
      </div>

      <div class="footer">
        <p>Thank you for choosing ${venueName}. For billing questions, contact accounting@banquetpro.com.</p>
        <p>This is a computer-generated invoice and requires no signature.</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const printAgreement = (book: Booking, cateringItems?: CateringItem[], venueName?: string) => {
  const finalVenueName = venueName || localStorage.getItem('tenantName') || 'My Banquet';
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const menuHTML = generateMenuHTML(book.menuSelection, cateringItems);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Event Agreement Contract - ${book.customerName}</title>
      <style>
        body { font-family: 'Georgia', serif; margin: 50px; color: #1a1b22; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px double #1a1b22; padding-bottom: 20px; margin-bottom: 40px; }
        .logo { font-size: 26px; font-weight: bold; letter-spacing: 1px; color: #1a1b22; }
        .title { font-size: 22px; font-weight: bold; margin-top: 15px; text-transform: uppercase; }
        .section-title { font-size: 15px; font-weight: bold; border-bottom: 1px solid #1a1b22; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; }
        .details-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 14px; }
        .terms { font-size: 12px; text-align: justify; }
        .signature-section { display: grid; grid-template-cols: 1fr 1fr; gap: 100px; margin-top: 80px; }
        .sig-line { border-top: 1px solid #1a1b22; text-align: center; font-size: 13px; padding-top: 8px; }
        .footer { text-align: center; margin-top: 60px; font-size: 11px; color: #444653; border-top: 1px dashed #e3e1eb; padding-top: 20px; }
        @media print {
          body { margin: 30px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">${finalVenueName}</div>
        <div class="title">Event Space & Reservation Agreement</div>
        <p style="margin: 5px 0 0 0; font-size: 12px; font-style: italic;">Contract Ref: AGR-${book.id.slice(-6).toUpperCase()}</p>
      </div>

      <p style="font-size: 14px;">This Event Reservation Agreement ("Agreement") is made on <strong>${new Date().toLocaleDateString('en-IN')}</strong> by and between <strong>${finalVenueName}</strong> ("Venue Owner") and the Host named below ("Client").</p>

      <div class="section-title">1. Contract Specifications</div>
      <div class="details-grid">
        <div>
          <p><strong>Client Name:</strong> ${book.customerName}</p>
          <p><strong>Contact Phone:</strong> ${book.phone || 'N/A'}</p>
          <p><strong>Billing Address:</strong> ${book.email || 'N/A'}</p>
        </div>
        <div>
          ${book.allocations && book.allocations.length > 0 ? `
            <div style="font-size: 11px; line-height: 1.4;">
              ${book.allocations.map((alloc, idx) => `
                <div style="margin-bottom: 5px; border-bottom: 1px dashed #eeedf7; padding-bottom: 3px;">
                  <strong>Event #${idx + 1}:</strong> ${alloc.venue}<br/>
                  <strong>Date:</strong> ${alloc.eventDate} | <strong>Slot:</strong> ${alloc.timeSlot} (${alloc.startTime || '10:00'})
                </div>
              `).join('')}
            </div>
            <p style="margin: 5px 0 0 0; font-size: 11px;"><strong>Guest Capacity Limit:</strong> ${book.pax || 150} Pax max</p>
          ` : `
            <p><strong>Event Reservation Date:</strong> ${book.eventDate}</p>
            <p><strong>Venue Allocation Space:</strong> ${book.venue}</p>
            <p><strong>Guest Capacity Limit:</strong> ${book.pax || 150} Pax max</p>
            ${book.timeSlot ? `<p><strong>Function Slot:</strong> ${book.timeSlot === 'Morning' ? 'Day Slot (10 AM - 4 PM)' : 'Night Slot (7 PM - 1 AM)'}</p>` : ''}
            ${book.startTime ? `<p><strong>Start Time:</strong> ${book.startTime}</p>` : ''}
          `}
        </div>
      </div>

      <div class="section-title">2. Financial Schedule</div>
      <p style="font-size: 14px;">The Client agrees to pay the total contract price of <strong>₹${(book.finalAmount || book.totalAmount).toLocaleString('en-IN')}</strong> (inclusive of all space rentals and catering services). A reservation deposit of <strong>₹${book.amountReceived.toLocaleString('en-IN')}</strong> has been received by the Venue Owner. The remaining balance of <strong>₹${book.pendingBalance.toLocaleString('en-IN')}</strong> must be paid in full 7 days prior to the event date.</p>

      ${menuHTML}

      <div class="section-title">3. Standard Terms & Conditions</div>
      <div class="terms">
        <p><strong>3.1 Cancellation Policy:</strong> Reservation deposits are strictly non-refundable and non-transferable. Cancellations within 30 days of the event date will incur the full contract charge.</p>
        <p><strong>3.2 Damage Liability:</strong> The Client assumes full responsibility for any damage done to the Venue property during the event setup, execution, and breakdown by their guests or hired vendor service partners.</p>
        <p><strong>3.3 Event Timing:</strong> Standard venue rental period is 6 hours. Extended hours will be billed at an additional hourly rate of ₹15,000 per hour, subject to availability.</p>
        <p><strong>3.4 Force Majeure:</strong> Neither party shall be liable for non-performance or cancellation due to acts of God, war, government regulations, or other civil emergencies beyond reasonable control.</p>
      </div>

      <div class="signature-section">
        <div class="sig-line">
          <strong>Client Authorized Representative</strong><br>
          Date: ________________________
        </div>
        <div class="sig-line">
          <strong>Venue Owner / Manager</strong><br>
          Date: ________________________
        </div>
      </div>

      <div class="footer">
        <p>This agreement shall be governed by and interpreted under the laws of the State. Thank you for your business!</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
