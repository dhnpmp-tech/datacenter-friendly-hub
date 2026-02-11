import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-12">
    <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
    {children}
  </section>
);

const Sub = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-6">
    <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
    {children}
  </div>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-muted-foreground mb-4">{children}</p>
);

const Table = ({ headers, rows }: { headers?: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full text-sm border-collapse">
      {headers && (
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2.5 px-4 border-b border-border font-semibold text-foreground bg-muted/50">{h}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className={`py-2.5 px-4 border-b border-border/50 text-muted-foreground ${j === 0 ? "font-medium text-foreground" : ""}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Ul = ({ items }: { items: string[] }) => (
  <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground mb-4 ml-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

const Ol = ({ items }: { items: string[] }) => (
  <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground mb-4 ml-1">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ol>
);

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-foreground">DC1 Privacy Policy</h1>

        <div className="mt-4 space-y-1 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Effective Date:</strong> February 11, 2026</p>
          <p><strong className="text-foreground">Last Updated:</strong> February 11, 2026</p>
          <p><strong className="text-foreground">Data Controller:</strong> HAAK Energy Solutions Company (CR: 7041633988), Kingdom of Saudi Arabia</p>
          <p><strong className="text-foreground">Supervisory Authority:</strong> Saudi Data and Artificial Intelligence Authority (SDAIA)</p>
        </div>

        <P>This Privacy Policy is prepared in compliance with the <strong className="text-foreground">Personal Data Protection Law (PDPL)</strong> of the Kingdom of Saudi Arabia, enforced by SDAIA and the National Data Management Office (NDMO).</P>

        <Section title="1. About This Policy">
          <P>This Privacy Policy explains how DC1 ("we," "us," or "our"), a product of HAAK Energy Solutions Company, collects, uses, stores, and protects your personal data when you visit our website (dc1.tech / dc1.sa) or interact with our services.</P>
          <P>By accessing our website or submitting information through our forms, you acknowledge that you have read and understood this Privacy Policy. We will obtain your explicit consent before collecting any personal data.</P>
        </Section>

        <Section title="2. Data Controller Information">
          <Table rows={[
            ["Entity Name", "HAAK Energy Solutions Company"],
            ["Commercial Registration", "7041633988"],
            ["Country", "Kingdom of Saudi Arabia"],
            ["Contact Email", "privacy@dc1.tech"],
            ["Data Protection Inquiries", "dpo@dc1.tech"],
          ]} />
        </Section>

        <Section title="3. Personal Data We Collect">
          <Sub title="3.1 Data You Provide Directly">
            <P>When you submit our Early Access form, we collect:</P>
            <p className="text-sm font-semibold text-foreground mb-2">For Hardware Providers:</p>
            <Ul items={[
              "Full name (required)", "Email address (required)", "Phone number (optional)",
              "Company or organization name (optional)", "City / location (required)",
              "Hardware type (GPU, CPU, Storage, Mixed)", "GPU models and number of units (optional)",
              "Monthly power cost in SAR (optional)", "Referral source (optional)",
              "Additional notes or messages (optional)",
            ]} />
            <p className="text-sm font-semibold text-foreground mb-2">For Compute Renters:</p>
            <Ul items={[
              "Full name (required)", "Email address (required)", "Phone number (optional)",
              "Company or organization name (optional)", "Use case category (required)",
              "GPU preference (optional)", "Estimated monthly budget range (optional)",
              "Referral source (optional)", "Additional notes or messages (optional)",
            ]} />
          </Sub>
          <Sub title="3.2 Data Collected Automatically">
            <P>When you visit our website, we automatically collect:</P>
            <Ul items={[
              "Browser-detected hardware information: GPU model and vendor (via WebGL API), CPU core count, approximate RAM, operating system. This data is processed locally in your browser and is not transmitted to our servers unless you explicitly submit the form.",
              "Analytics data: Page views, button clicks, form interactions, timestamps. Collected and stored without personally identifying information unless linked to a form submission.",
              "Technical data: Browser type and version, device type, screen resolution, IP address (anonymized), referring URL.",
            ]} />
          </Sub>
          <Sub title="3.3 Sensitive Personal Data">
            <P>We do <strong className="text-foreground">not</strong> collect sensitive personal data as defined by the PDPL, including but not limited to: health data, biometric data, genetic data, religious beliefs, political opinions, criminal records, or financial account details.</P>
          </Sub>
        </Section>

        <Section title="4. Purposes of Processing">
          <P>We process your personal data for the following specific purposes:</P>
          <Table headers={["Purpose", "Legal Basis"]} rows={[
            ["Processing your early access application", "Consent (form submission)"],
            ["Communicating with you about DC1 services", "Consent"],
            ["Matching providers with renters (when platform launches)", "Contractual necessity"],
            ["Analyzing website usage to improve our services", "Legitimate interest"],
            ["Providing hardware earnings estimates", "Consent (form submission)"],
            ["Complying with legal and regulatory obligations", "Legal obligation"],
            ["Responding to your inquiries", "Consent"],
          ]} />
          <P>We will <strong className="text-foreground">not</strong> process your data for any purpose other than those stated above without obtaining your prior consent.</P>
        </Section>

        <Section title="5. Consent">
          <Sub title="5.1 How We Obtain Consent">
            <Ul items={[
              "Consent is obtained explicitly before any data collection through clear form submission actions.",
              "You will be presented with this Privacy Policy and asked to acknowledge it before submitting any personal data.",
              "Consent for analytics cookies (if applicable) is obtained via a cookie consent banner upon your first visit.",
            ]} />
          </Sub>
          <Sub title="5.2 Withdrawing Consent">
            <P>You may withdraw your consent at any time by:</P>
            <Ul items={[
              "Emailing us at privacy@dc1.tech",
              "Using the data request form on our website (when available)",
            ]} />
            <P>Withdrawal of consent does not affect the lawfulness of processing carried out before withdrawal.</P>
          </Sub>
        </Section>

        <Section title="6. Your Rights as a Data Subject">
          <P>Under the PDPL, you have the following rights regarding your personal data:</P>
          <Sub title="6.1 Right of Access">
            <P>You may request access to the personal data we hold about you, including details of how it is processed, who has access, and where it is stored.</P>
          </Sub>
          <Sub title="6.2 Right to Rectification">
            <P>You may request correction of any inaccurate or incomplete personal data we hold about you.</P>
          </Sub>
          <Sub title="6.3 Right to Erasure (Right to Be Forgotten)">
            <P>You may request deletion of your personal data where:</P>
            <Ul items={[
              "The data is no longer necessary for the purpose it was collected",
              "You withdraw your consent",
              "The data has been unlawfully processed",
            ]} />
          </Sub>
          <Sub title="6.4 Right to Know">
            <P>You have the right to know the legal basis and purpose for the collection and processing of your personal data.</P>
          </Sub>
          <Sub title="6.5 Right to Object">
            <P>You may object to the processing of your personal data in certain circumstances, including processing for direct marketing purposes.</P>
          </Sub>
          <Sub title="6.6 How to Exercise Your Rights">
            <P>To exercise any of these rights, contact us at:</P>
            <Ul items={[
              'Email: privacy@dc1.tech',
              'Subject line: "Data Subject Request — [Your Right]"',
            ]} />
            <P>We will respond to your request within <strong className="text-foreground">30 days</strong>. No account creation is required to submit a request.</P>
          </Sub>
        </Section>

        <Section title="7. Data Storage and Security">
          <Sub title="7.1 Where Your Data Is Stored">
            <P>Your personal data is stored on secure servers with the following security measures:</P>
            <Ul items={[
              "Encryption at rest (AES-256)",
              "Encryption in transit (TLS 1.3)",
              "Row-level security policies",
              "Access restricted to authorized personnel only",
            ]} />
          </Sub>
          <Sub title="7.2 Data Localization">
            <P>In accordance with Saudi data residency requirements:</P>
            <Ul items={[
              "We are committed to storing Saudi residents' personal data within the Kingdom of Saudi Arabia once local infrastructure is operational.",
              "During our early access phase, data may be stored on internationally hosted servers with appropriate safeguards (see Section 8).",
            ]} />
          </Sub>
          <Sub title="7.3 Security Measures">
            <P>We implement organizational and technical measures proportionate to the sensitivity and volume of data processed, including:</P>
            <Ul items={[
              "Access controls and authentication",
              "Regular security assessments",
              "Encrypted communications",
              "Audit logging of data access",
              "Employee data protection training",
            ]} />
          </Sub>
        </Section>

        <Section title="8. Cross-Border Data Transfers">
          <P>If your personal data is transferred outside the Kingdom of Saudi Arabia, we ensure:</P>
          <Ul items={[
            "The transfer is limited to the minimum data necessary",
            "Appropriate safeguards are in place (contractual clauses with processors)",
            "The transfer does not compromise the national security or vital interests of the Kingdom",
            "You are informed of the transfer and the recipient country",
          ]} />
          <P>We will not transfer your data to any jurisdiction that does not provide adequate data protection without implementing supplementary safeguards as required by the PDPL.</P>
        </Section>

        <Section title="9. Data Retention">
          <P>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected:</P>
          <Table headers={["Data Category", "Retention Period"]} rows={[
            ["Waitlist / early access submissions", "Until 12 months after platform launch, or until you request deletion"],
            ["Analytics data (non-personal)", "24 months"],
            ["Communication records", "12 months after last interaction"],
            ["Hardware detection data (browser)", "Not retained — processed locally only"],
          ]} />
          <P>Upon expiration of the retention period, data is securely deleted or anonymized.</P>
        </Section>

        <Section title="10. Data Sharing and Third Parties">
          <P>We do <strong className="text-foreground">not</strong> sell, rent, or trade your personal data.</P>
          <P>We may share your data with the following categories of recipients, solely for the purposes described in this policy:</P>
          <Table headers={["Recipient", "Purpose", "Safeguards"]} rows={[
            ["Database provider", "Data storage and processing", "Data Processing Agreement, encryption"],
            ["Cloudflare (hosting/CDN)", "Website delivery and security", "Standard contractual clauses"],
            ["Team members (HAAK Energy Solutions)", "Processing applications, communication", "Access controls, NDA"],
          ]} />
          <P>All third-party processors are contractually bound to process data only as instructed and to implement appropriate security measures.</P>
        </Section>

        <Section title="11. Cookies and Tracking">
          <Sub title="11.1 Essential Cookies">
            <P>We use essential cookies required for the website to function. These cannot be disabled.</P>
          </Sub>
          <Sub title="11.2 Analytics">
            <P>We collect anonymized usage analytics (page views, interactions) to improve our services. No third-party advertising cookies are used.</P>
          </Sub>
          <Sub title="11.3 Cookie Consent">
            <P>A cookie consent banner is presented on your first visit. You may modify your preferences at any time.</P>
          </Sub>
        </Section>

        <Section title="12. Children's Data">
          <P>Our services are not directed at individuals under the age of 18. We do not knowingly collect personal data from minors. If we become aware that we have collected data from a minor, we will delete it immediately.</P>
        </Section>

        <Section title="13. Data Breach Response">
          <P>In the event of a personal data breach:</P>
          <Ol items={[
            "We will notify SDAIA within 72 hours of becoming aware of the breach",
            "We will notify affected data subjects without undue delay if the breach poses a risk to their rights",
            "We will document the breach, its effects, and remedial actions taken",
            "Where applicable, we will also report to the Communications, Space & Technology Commission (CST)",
          ]} />
        </Section>

        <Section title="14. Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. Changes will be:</P>
          <Ul items={[
            'Posted on this page with an updated "Last Updated" date',
            "Communicated to registered users via email if the changes are material",
          ]} />
          <P>We encourage you to review this policy periodically.</P>
        </Section>

        <Section title="15. Governing Law and Jurisdiction">
          <P>This Privacy Policy is governed by the laws of the Kingdom of Saudi Arabia, including the Personal Data Protection Law (PDPL). Any disputes arising from this policy shall be subject to the jurisdiction of the competent courts in the Kingdom of Saudi Arabia.</P>
        </Section>

        <Section title="16. Contact Us">
          <P>For any questions, concerns, or requests related to this Privacy Policy or your personal data:</P>
          <Table rows={[
            ["Email", "privacy@dc1.tech"],
            ["Data Protection Officer", "dpo@dc1.tech"],
            ["Company", "HAAK Energy Solutions Company"],
            ["Supervisory Authority", "SDAIA — sdaia.gov.sa"],
          ]} />
        </Section>

        <hr className="border-border mt-12 mb-6" />
        <p className="text-xs text-muted-foreground italic">
          This Privacy Policy has been prepared in alignment with the Saudi Personal Data Protection Law (PDPL), SDAIA regulations, and NDMO data governance guidelines.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © 2026 HAAK Energy Solutions Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
