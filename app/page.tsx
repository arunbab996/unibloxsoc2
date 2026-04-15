"use client";

import { useState, useMemo } from "react";

const OWNERS = ["Engineering", "HR", "Legal", "Ops", "Founder", "Security", "Finance"];
const STATUSES = ["Not Started", "In Progress", "Done", "N/A"];

type Control = {
  id: number;
  cat: string;
  ref: string;
  control: string;
  desc: string;
  owner: string;
  status: string;
  notes: string;
};

function statusStyle(status: string, dark: boolean) {
  const map: Record<string, { bg: string; color: string; darkBg: string; darkColor: string }> = {
    "Done":        { bg: "#eaf3de", color: "#3b6d11", darkBg: "#14330a", darkColor: "#86efac" },
    "In Progress": { bg: "#faeeda", color: "#854f0b", darkBg: "#3a1f00", darkColor: "#fbbf24" },
    "Not Started": { bg: "#f1efe8", color: "#5f5e5a", darkBg: "#1e293b", darkColor: "#94a3b8" },
    "N/A":         { bg: "#e6f1fb", color: "#185fa5", darkBg: "#0c1f3a", darkColor: "#60a5fa" },
  };
  const s = map[status] ?? map["Not Started"];
  return { background: dark ? s.darkBg : s.bg, color: dark ? s.darkColor : s.color };
}

const ALL: Control[] = [
  // CC1 Control Environment
  {
    id: 1, cat: "CC1 - Control Environment", ref: "CC1.1",
    control: "Management has defined organizational structure with clear reporting lines",
    desc: "Auditors look for an up-to-date org chart and documented accountability for security roles. At an early stage, a simple chart reviewed by the founder annually satisfies this. The goal is ensuring no ambiguity in who is responsible for what.",
    owner: "Founder", status: "Not Started", notes: "",
  },
  {
    id: 2, cat: "CC1 - Control Environment", ref: "CC1.2",
    control: "Board or equivalent oversight body reviews security program annually",
    desc: "Evidence that leadership or a board-equivalent reviews the security program at least once per year. Meeting minutes, a signed review memo, or a board deck with a security agenda item all count. At early stage, this is often the founder plus investors or advisors.",
    owner: "Founder", status: "Not Started", notes: "",
  },
  {
    id: 3, cat: "CC1 - Control Environment", ref: "CC1.3",
    control: "Security policies formally documented and approved by leadership",
    desc: "A formal Information Security Policy signed by the CEO or equivalent is the cornerstone of your SOC 2 program. It must be version-controlled, dated, and referenced by all other security policies. Without this, almost every other control lacks a governing foundation.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 4, cat: "CC1 - Control Environment", ref: "CC1.4",
    control: "Roles and responsibilities for security documented across functions",
    desc: "Each team's security responsibilities must be explicitly documented - a RACI matrix or job description language that ties individuals to specific controls. Auditors want to see that security ownership is clear and not assumed.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 5, cat: "CC1 - Control Environment", ref: "CC1.5",
    control: "Code of conduct or ethics policy in place and signed by all employees",
    desc: "A written code of conduct covering data confidentiality, conflicts of interest, and acceptable behavior. All employees and contractors must sign it on hire and annually. DocuSign acknowledgment records are the standard evidence auditors request.",
    owner: "HR", status: "Not Started", notes: "",
  },
  {
    id: 6, cat: "CC1 - Control Environment", ref: "CC1.6",
    control: "Background checks completed for all employees and contractors",
    desc: "Pre-employment background checks must be completed before granting access to production systems or customer data. Scope should match data sensitivity - at minimum, identity and criminal history verification. Keep records of completion for each individual.",
    owner: "HR", status: "Done", notes: "",
  },
  {
    id: 7, cat: "CC1 - Control Environment", ref: "CC1.7",
    control: "Performance reviews include security responsibilities",
    desc: "Security responsibilities should appear in formal performance review cycles. This demonstrates the control environment is embedded in culture, not just documented on paper. Auditors look for evidence that security behaviors are formally evaluated.",
    owner: "HR", status: "Not Started", notes: "",
  },
  {
    id: 8, cat: "CC1 - Control Environment", ref: "CC1.8",
    control: "Disciplinary process defined for security policy violations",
    desc: "A documented HR process for responding to policy violations - warnings, suspension, termination. Its existence signals that management takes control failures seriously. Auditors verify it exists and is communicated to all staff, not that it has been used.",
    owner: "HR", status: "Not Started", notes: "",
  },
  {
    id: 9, cat: "CC1 - Control Environment", ref: "CC1.9",
    control: "Organizational chart maintained and up to date",
    desc: "An accurate, dated org chart reviewed whenever headcount changes. Auditors use this to verify that reporting lines match what is described in other documents and that security roles are clearly assigned.",
    owner: "Ops", status: "In Progress", notes: "",
  },
  {
    id: 10, cat: "CC1 - Control Environment", ref: "CC1.10",
    control: "Security awareness training completed annually by all staff",
    desc: "Annual security awareness training for all staff covering phishing, data handling, and incident reporting. Completion must be tracked - LMS records or quiz results are the primary evidence auditors request. Untrained employees are a common audit finding.",
    owner: "HR", status: "Not Started", notes: "",
  },
  {
    id: 11, cat: "CC1 - Control Environment", ref: "CC1.11",
    control: "New hire security onboarding process documented",
    desc: "A documented onboarding checklist covering security policy acknowledgment, access provisioning, and tool setup. Ensures every new hire understands security expectations before they access systems - and gives auditors a consistent evidence trail.",
    owner: "HR", status: "Not Started", notes: "",
  },
  {
    id: 12, cat: "CC1 - Control Environment", ref: "CC1.12",
    control: "Employee termination includes immediate access revocation procedure",
    desc: "Access to all systems must be revoked on the employee's last day - ideally within hours. Auditors test this by sampling recent terminations and checking access logs. A termination checklist with IT sign-off is the standard evidence.",
    owner: "HR", status: "In Progress", notes: "",
  },
  // CC2 Communication & Information
  {
    id: 13, cat: "CC2 - Communication & Information", ref: "CC2.1",
    control: "Security policies communicated to all employees on hire and annually",
    desc: "Policies must be actively communicated, not just posted to a wiki. Evidence includes distribution records, acknowledgment sign-offs, and annual re-confirmation from all staff. Passive availability does not satisfy this control.",
    owner: "HR", status: "Not Started", notes: "",
  },
  {
    id: 14, cat: "CC2 - Communication & Information", ref: "CC2.2",
    control: "Internal process for employees to report security concerns or incidents",
    desc: "Employees need a clear, low-friction way to report suspected incidents or policy concerns. This can be as simple as a dedicated Slack channel or security@company.com alias, as long as it is documented and someone is responsible for triaging reports.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 15, cat: "CC2 - Communication & Information", ref: "CC2.3",
    control: "Customer-facing security and privacy documentation published",
    desc: "Customer-facing documentation must accurately describe your security practices. This typically includes a Trust Center, security page, or privacy policy on your website. Enterprise prospects and auditors both look for this during vendor assessments.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 16, cat: "CC2 - Communication & Information", ref: "CC2.4",
    control: "Vendor and third-party security requirements communicated in contracts",
    desc: "Security expectations for third-party vendors must be formalized in contracts. Minimum requirements include data handling obligations, breach notification timelines, and access control standards. A vendor addendum or DPA typically covers this.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 17, cat: "CC2 - Communication & Information", ref: "CC2.5",
    control: "Incident notification process for customers defined and documented",
    desc: "A documented process for notifying affected customers if a security incident occurs. Must include who approves the notification, the communication channel, and target timelines. Without this, breach response under pressure becomes improvised.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 18, cat: "CC2 - Communication & Information", ref: "CC2.6",
    control: "Security updates and changes communicated to affected stakeholders",
    desc: "When security controls or policies change materially, affected stakeholders must be informed. This includes engineering teams, customers in some cases, and relevant internal owners. Auditors look for evidence of a communication process, not just the changes themselves.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 19, cat: "CC2 - Communication & Information", ref: "CC2.7",
    control: "Acceptable Use Policy distributed and acknowledged by all staff",
    desc: "An Acceptable Use Policy covers approved uses of company systems, data, and networks - and prohibited activities. All employees must acknowledge it. Auditors distinguish between having the document and having evidence of distribution and sign-off.",
    owner: "HR", status: "Not Started", notes: "",
  },
  // CC3 Risk Assessment
  {
    id: 20, cat: "CC3 - Risk Assessment", ref: "CC3.1",
    control: "Annual formal risk assessment process completed",
    desc: "A formal, documented risk assessment conducted at least annually. Auditors look for a structured process: identify threats, assess likelihood and impact, document findings, assign owners. The output feeds your risk register and informs control prioritization.",
    owner: "Security", status: "Not Started", notes: "Q3 target",
  },
  {
    id: 21, cat: "CC3 - Risk Assessment", ref: "CC3.2",
    control: "Risk register created, maintained, and reviewed quarterly",
    desc: "A living risk register tracking identified risks with owners, ratings, and remediation plans. Must be reviewed and updated at defined intervals - quarterly is the SOC 2 expectation. Stale registers with no activity are a common audit finding.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 22, cat: "CC3 - Risk Assessment", ref: "CC3.3",
    control: "Threat modeling completed for core product architecture",
    desc: "Systematic analysis of your system architecture to identify trust boundaries, data flows, and attack surfaces. Documents known threats and how controls mitigate them. Typically completed as a workshop with engineering and documented in a formal output.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 23, cat: "CC3 - Risk Assessment", ref: "CC3.4",
    control: "Penetration testing conducted by third party annually",
    desc: "An annual penetration test by an independent third-party firm, with findings tracked to remediation. Auditors look for the scoping document, the test report, and evidence of follow-up on critical and high findings. Self-conducted tests do not satisfy this control.",
    owner: "Security", status: "Not Started", notes: "Vendor shortlisted",
  },
  {
    id: 24, cat: "CC3 - Risk Assessment", ref: "CC3.5",
    control: "Vulnerability scanning runs automatically on production systems",
    desc: "Automated scanning tools integrated into your pipeline or running continuously against production infrastructure. Evidence includes scan reports, finding logs, and documented remediation SLAs. Snyk, AWS Inspector, and Wiz are common options.",
    owner: "Engineering", status: "In Progress", notes: "Snyk integrated",
  },
  {
    id: 25, cat: "CC3 - Risk Assessment", ref: "CC3.6",
    control: "Risk appetite and tolerance defined by leadership",
    desc: "Leadership must explicitly define what level of risk is acceptable and at what threshold risks require escalation or remediation. Documents the business context for control decisions and helps auditors understand how risk is governed at the executive level.",
    owner: "Founder", status: "Not Started", notes: "",
  },
  {
    id: 26, cat: "CC3 - Risk Assessment", ref: "CC3.7",
    control: "Findings from risk assessments tracked to remediation",
    desc: "Risk assessment findings must be tracked to closure with assigned owners and deadlines. An open risk register with status fields and review dates satisfies this. Auditors test whether risks identified in prior periods have been addressed or formally accepted.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 27, cat: "CC3 - Risk Assessment", ref: "CC3.8",
    control: "Supply chain and dependency risks assessed",
    desc: "Third-party libraries, open-source dependencies, and SaaS vendors all introduce supply chain risk. Auditors expect a process for evaluating these risks during vendor onboarding and a tool like Snyk or Dependabot for continuous dependency monitoring.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 28, cat: "CC3 - Risk Assessment", ref: "CC3.9",
    control: "Data classification policy defined (public, internal, confidential, restricted)",
    desc: "A formal data classification scheme that defines how each tier must be handled, stored, and shared. Without this, other data protection controls lack a governing framework. Typically four tiers: Public, Internal, Confidential, and Restricted.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  // CC4 Monitoring Activities
  {
    id: 29, cat: "CC4 - Monitoring Activities", ref: "CC4.1",
    control: "Security controls monitored continuously or reviewed on defined schedule",
    desc: "Controls must be actively monitored, not just implemented. Evidence includes dashboards, scheduled reviews, automated alerts, and documented review cycles. Auditors distinguish between controls that exist and controls that are verified to be working.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 30, cat: "CC4 - Monitoring Activities", ref: "CC4.2",
    control: "Internal audits or control reviews conducted at least annually",
    desc: "At least one internal audit or formal control review per year. Can be self-conducted at early stage, but must be documented with findings and a follow-up action plan. The absence of any internal review is a red flag for SOC 2 auditors.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 31, cat: "CC4 - Monitoring Activities", ref: "CC4.3",
    control: "Deficiencies identified in monitoring are tracked and remediated",
    desc: "Any gaps found during monitoring must be tracked to remediation with owners and deadlines. Auditors want to see that deficiencies are not left open indefinitely. A simple tracking spreadsheet with status updates is sufficient.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 32, cat: "CC4 - Monitoring Activities", ref: "CC4.4",
    control: "Third-party audit or assessment results reviewed by management",
    desc: "Results from third-party audits or assessments must be formally reviewed by management - not just filed away. Meeting notes or a signed review memo works as evidence. Auditors check that leadership is aware of and responsive to external findings.",
    owner: "Founder", status: "Not Started", notes: "",
  },
  {
    id: 33, cat: "CC4 - Monitoring Activities", ref: "CC4.5",
    control: "Key performance indicators for security defined and tracked",
    desc: "Define measurable security KPIs - such as percentage of vulnerabilities remediated within SLA, training completion rate, or mean time to detect - and track them over time. Demonstrates proactive monitoring rather than reactive firefighting.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 34, cat: "CC4 - Monitoring Activities", ref: "CC4.6",
    control: "Management reviews security metrics at regular leadership cadence",
    desc: "Security metrics should be reviewed at regular leadership meetings - monthly or quarterly. Agenda items or meeting notes with security discussion are the evidence. Auditors look for evidence that leadership is engaged, not just delegating.",
    owner: "Founder", status: "Not Started", notes: "",
  },
  // CC5 Control Activities
  {
    id: 35, cat: "CC5 - Control Activities", ref: "CC5.1",
    control: "Information security policy formally documented and version-controlled",
    desc: "Your Information Security Policy must be formally written, version-controlled with dates and authors, and approved by leadership. This is the foundational document for your entire SOC 2 program - all other policies reference back to it.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 36, cat: "CC5 - Control Activities", ref: "CC5.2",
    control: "Acceptable use of technology resources policy in place",
    desc: "Defines acceptable uses of company systems, devices, and networks - and explicitly prohibited activities. Must cover internet use, software installation, and data handling. All employees acknowledge it on hire and after material updates.",
    owner: "HR", status: "Not Started", notes: "",
  },
  {
    id: 37, cat: "CC5 - Control Activities", ref: "CC5.3",
    control: "Password policy enforced: minimum length, complexity, rotation",
    desc: "Password requirements must be technically enforced, not just stated in policy. Minimum 12 characters, complexity requirements, no credential reuse. MFA is the strongest compensating control - auditors increasingly treat MFA as table stakes alongside strong passwords.",
    owner: "Engineering", status: "In Progress", notes: "",
  },
  {
    id: 38, cat: "CC5 - Control Activities", ref: "CC5.4",
    control: "Clean desk and screen lock policy defined for remote and office workers",
    desc: "Requires employees to lock screens when stepping away and clear desks of sensitive materials. MDM-enforced screen lock (e.g. 5-minute auto-lock) is the technical control. Relevant for both office and remote workers handling confidential data.",
    owner: "HR", status: "Not Started", notes: "",
  },
  {
    id: 39, cat: "CC5 - Control Activities", ref: "CC5.5",
    control: "Mobile device management (MDM) policy and tooling in place",
    desc: "MDM software (Jamf, Kandji, Mosyle) installed on all company devices to enforce encryption, screen lock, and remote wipe capabilities. Critical for laptop-heavy startups. Auditors verify coverage across all company-owned devices.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 40, cat: "CC5 - Control Activities", ref: "CC5.6",
    control: "Bring-your-own-device (BYOD) policy defined if applicable",
    desc: "If employees use personal devices for work, a BYOD policy must define security requirements (MDM enrollment, approved apps, remote wipe consent). If company-issued devices only, this control is N/A - document that rationale explicitly.",
    owner: "Legal", status: "N/A", notes: "Company devices only",
  },
  {
    id: 41, cat: "CC5 - Control Activities", ref: "CC5.7",
    control: "Software and asset inventory maintained and reviewed",
    desc: "A complete inventory of all software, hardware, and cloud assets in use. Helps identify shadow IT and ensures security controls are applied consistently across all systems. Auditors test coverage by comparing the inventory to observed systems.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 42, cat: "CC5 - Control Activities", ref: "CC5.8",
    control: "Patch management policy: critical patches applied within defined SLA",
    desc: "Critical security patches must be applied within a defined SLA (e.g. 7 days for critical CVEs, 30 days for high). MDM patch management or automated update policies provide the evidence trail. Unpatched systems are among the most common audit findings.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 43, cat: "CC5 - Control Activities", ref: "CC5.9",
    control: "Endpoint protection (antivirus/EDR) deployed on all devices",
    desc: "Endpoint protection (antivirus or EDR like CrowdStrike, SentinelOne, or Defender) deployed on all company-managed devices. Auditors verify deployment coverage and that threat definitions are current. Gaps in coverage are a frequent finding.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  // CC6 Access Control
  {
    id: 44, cat: "CC6 - Access Control", ref: "CC6.1",
    control: "MFA enforced on all production systems and cloud infrastructure",
    desc: "MFA must be enforced at the policy level - not just available for users to enable. AWS SSO, GCP, and Azure all support MFA enforcement. This is one of the highest-priority controls for SOC 2 and a frequent starting point for auditor testing.",
    owner: "Engineering", status: "In Progress", notes: "AWS done, internal tooling pending",
  },
  {
    id: 45, cat: "CC6 - Access Control", ref: "CC6.2",
    control: "MFA enforced on email and collaboration tools (Google Workspace, Slack)",
    desc: "Email and collaboration tools are primary attack vectors via phishing and credential stuffing. MFA enforcement in Google Workspace Admin and Slack is a quick win and a frequent auditor focus area. Verify it is enforced for all users, including contractors.",
    owner: "Engineering", status: "Done", notes: "",
  },
  {
    id: 46, cat: "CC6 - Access Control", ref: "CC6.3",
    control: "Unique user accounts - no shared or generic credentials",
    desc: "Every user must have a unique, traceable account. Shared or generic credentials make audit trails impossible and are a clear SOC 2 finding. This applies to service accounts too - each should have a named owner and a documented purpose.",
    owner: "Engineering", status: "Done", notes: "",
  },
  {
    id: 47, cat: "CC6 - Access Control", ref: "CC6.4",
    control: "Role-based access control (RBAC) implemented across systems",
    desc: "Access permissions tied to job roles rather than individuals makes provisioning, reviewing, and revoking access consistent and auditable. Auditors look for documented roles, assignments, and evidence that role definitions are kept current.",
    owner: "Engineering", status: "In Progress", notes: "",
  },
  {
    id: 48, cat: "CC6 - Access Control", ref: "CC6.5",
    control: "Principle of least privilege enforced - users have minimum necessary access",
    desc: "Users should only have access to what they need for their current role - nothing more. Auditors test this by reviewing access lists and comparing them to job functions. Over-provisioned access is one of the most common findings in access control reviews.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 49, cat: "CC6 - Access Control", ref: "CC6.6",
    control: "Access provisioning process documented and requires manager approval",
    desc: "Access to any system must follow a documented approval process with a traceable record. A Slack message from a manager, a ticket in Jira, or a form in your HRIS all work. The key is a dated approval that auditors can sample and verify.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 50, cat: "CC6 - Access Control", ref: "CC6.7",
    control: "Access deprovisioning completed within 24h of employee termination",
    desc: "When someone leaves, all system access must be revoked promptly - ideally on the last day. Auditors test this by sampling recent terminations and checking access logs. Delays between offboarding and deprovisioning are a critical finding.",
    owner: "HR", status: "In Progress", notes: "",
  },
  {
    id: 51, cat: "CC6 - Access Control", ref: "CC6.8",
    control: "Quarterly access reviews conducted across all critical systems",
    desc: "Quarterly reviews confirm that each person's access still matches their current role. Reviewers should be system owners or managers. Evidence includes review logs with sign-offs, and evidence that access was removed where reviewers flagged it as inappropriate.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 52, cat: "CC6 - Access Control", ref: "CC6.9",
    control: "Privileged/admin access limited to named individuals with justification",
    desc: "Admin and root access must be limited to a named list of individuals with documented justification for each. Auditors look for the access list, evidence of periodic review, and confirmation that admin access is not used for day-to-day tasks.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 53, cat: "CC6 - Access Control", ref: "CC6.10",
    control: "SSH key management policy - rotation schedule and inventory",
    desc: "SSH keys must be inventoried, tied to named individuals, and rotated on a defined schedule. Orphaned or unattributed keys are a common finding in cloud environments. AWS EC2 key pairs and bastion host access should be included in scope.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 54, cat: "CC6 - Access Control", ref: "CC6.11",
    control: "API keys and secrets stored in secrets manager (not hardcoded)",
    desc: "Secrets, API keys, and credentials must never be hardcoded in source code or config files. A secrets manager (AWS Secrets Manager, HashiCorp Vault, 1Password Secrets) is the expected solution. Auditors sometimes review code repositories for leaked credentials.",
    owner: "Engineering", status: "In Progress", notes: "AWS Secrets Manager in use",
  },
  {
    id: 55, cat: "CC6 - Access Control", ref: "CC6.12",
    control: "VPN or zero-trust access required for internal systems",
    desc: "Production systems should not be directly reachable from the internet without access controls. VPN, bastion hosts, or a zero-trust solution (Tailscale, Cloudflare Access) satisfy this. Auditors verify that internal tools are not publicly exposed.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 56, cat: "CC6 - Access Control", ref: "CC6.13",
    control: "Physical access to office restricted to authorized personnel",
    desc: "Physical access to office and server areas must be restricted to authorized personnel. Keycard access systems with access logs are the standard evidence. Visitor logs and escort procedures for non-employees are also expected.",
    owner: "Ops", status: "Done", notes: "Keycard access in place",
  },
  {
    id: 57, cat: "CC6 - Access Control", ref: "CC6.14",
    control: "Server infrastructure hosted in SOC 2 certified data centers (e.g. AWS)",
    desc: "Using AWS, GCP, or Azure means your infrastructure inherits their SOC 2 certifications for physical security and data center controls. Keep a copy of their latest SOC 2 Type II report and note which controls are covered by the subservice organization.",
    owner: "Engineering", status: "Done", notes: "AWS us-east-1",
  },
  {
    id: 58, cat: "CC6 - Access Control", ref: "CC6.15",
    control: "Guest WiFi network separated from internal/corporate network",
    desc: "Guest WiFi and corporate networks must be isolated to prevent lateral movement if a guest device is compromised. A separate VLAN or SSID for guests satisfies this. Router configuration documentation is the evidence auditors request.",
    owner: "Engineering", status: "Done", notes: "",
  },
  {
    id: 59, cat: "CC6 - Access Control", ref: "CC6.16",
    control: "SSO (single sign-on) deployed for SaaS tool access",
    desc: "SSO centralizes access management and makes deprovisioning clean and reliable. When an employee leaves, revoking SSO access removes access to all connected tools simultaneously. Okta, Azure AD, and Google Workspace all support SSO federation.",
    owner: "Engineering", status: "Not Started", notes: "Evaluating Okta",
  },
  // CC7 System Operations
  {
    id: 60, cat: "CC7 - System Operations", ref: "CC7.1",
    control: "Audit logging enabled on all production systems and cloud accounts",
    desc: "Audit logs capture who did what, when, across all production systems. AWS CloudTrail, GCP Audit Logs, and application-level logging are all in scope. Gaps in audit logging are critical findings - without logs, incident investigations cannot be completed.",
    owner: "Engineering", status: "In Progress", notes: "CloudTrail on, app logs pending",
  },
  {
    id: 61, cat: "CC7 - System Operations", ref: "CC7.2",
    control: "Log retention policy defined - minimum 90 days, 1 year preferred",
    desc: "Logs must be retained long enough to support incident investigations that may be discovered weeks after the fact. SOC 2 auditors typically expect a minimum of 90 days hot (searchable) and 12 months archived. Document the policy and verify it is enforced technically.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 62, cat: "CC7 - System Operations", ref: "CC7.3",
    control: "Centralized log aggregation in place (e.g. CloudWatch, Datadog)",
    desc: "Logs from multiple systems should flow into a central platform for correlation and alerting. CloudWatch, Datadog, and Splunk are common options. Centralization makes investigation and review practical - siloed logs are difficult to search during incidents.",
    owner: "Engineering", status: "In Progress", notes: "",
  },
  {
    id: 63, cat: "CC7 - System Operations", ref: "CC7.4",
    control: "Alerts configured for unauthorized or anomalous access attempts",
    desc: "Automated alerts for suspicious activity - failed login attempts, privilege escalation, unusual data access volumes. Without alerting, anomalies are only discovered after the fact, often long after a breach has occurred.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 64, cat: "CC7 - System Operations", ref: "CC7.5",
    control: "Uptime and performance monitoring in place with alerting",
    desc: "Real-time uptime monitoring with alert escalation paths. Datadog, PagerDuty, or New Relic are common solutions. Auditors look for documentation of what is monitored, alerting thresholds, and how quickly the on-call team responds.",
    owner: "Engineering", status: "Done", notes: "",
  },
  {
    id: 65, cat: "CC7 - System Operations", ref: "CC7.6",
    control: "On-call rotation defined with documented escalation path",
    desc: "A defined on-call schedule ensures someone is always reachable for production incidents. PagerDuty or Opsgenie records are standard evidence, along with escalation path documentation showing who gets notified if the primary contact does not respond.",
    owner: "Engineering", status: "In Progress", notes: "PagerDuty setup",
  },
  {
    id: 66, cat: "CC7 - System Operations", ref: "CC7.7",
    control: "Malware and intrusion detection tooling deployed",
    desc: "Tools like CrowdStrike, Wiz, or AWS GuardDuty detect intrusions and malware at the host or network level. Auditors expect both deployment evidence and a process for responding to alerts. Detection without response is not sufficient.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 67, cat: "CC7 - System Operations", ref: "CC7.8",
    control: "Network firewall rules documented and reviewed quarterly",
    desc: "Firewall rules governing inbound and outbound traffic must be documented and reviewed regularly. Security groups, NACLs, and WAF rules in AWS are the typical evidence. Quarterly review should confirm that no unnecessary ports or IPs are exposed.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 68, cat: "CC7 - System Operations", ref: "CC7.9",
    control: "Production database access restricted and logged",
    desc: "Direct access to production databases should require explicit approval, be time-limited, and be fully logged. Database activity monitoring (DAM) tools strengthen this control. Auditors test whether engineers have standing direct database access.",
    owner: "Engineering", status: "In Progress", notes: "",
  },
  {
    id: 69, cat: "CC7 - System Operations", ref: "CC7.10",
    control: "Security event correlation and SIEM tooling in place or planned",
    desc: "A SIEM correlates events across multiple systems to detect attacks that span data sources. AWS Security Hub, Datadog Security, or Elastic SIEM are common early-stage options. At minimum, a plan and timeline for SIEM adoption should be documented.",
    owner: "Security", status: "Not Started", notes: "",
  },
  // CC8 Change Management
  {
    id: 70, cat: "CC8 - Change Management", ref: "CC8.1",
    control: "Code review (PR approval) required before production deployment",
    desc: "Every code change to production must be reviewed and approved by at least one peer before merging. GitHub branch protection rules with required reviewers are the standard implementation. Auditors sample pull requests and verify approval records exist.",
    owner: "Engineering", status: "Done", notes: "GitHub branch protection",
  },
  {
    id: 71, cat: "CC8 - Change Management", ref: "CC8.2",
    control: "Automated CI/CD pipeline with security checks integrated",
    desc: "Automated pipelines run security scans, tests, and linting on every pull request before code reaches production. This reduces human error, enforces consistency, and creates an audit trail of every deployment including what checks passed.",
    owner: "Engineering", status: "In Progress", notes: "",
  },
  {
    id: 72, cat: "CC8 - Change Management", ref: "CC8.3",
    control: "Separate staging and production environments enforced",
    desc: "Code changes must be tested in a staging environment that mirrors production before deployment. Prevents untested changes from reaching customers and satisfies change management requirements. Auditors verify the environments are logically and often physically separate.",
    owner: "Engineering", status: "Done", notes: "",
  },
  {
    id: 73, cat: "CC8 - Change Management", ref: "CC8.4",
    control: "Emergency change procedure documented for hotfixes",
    desc: "A documented process for urgent production fixes that bypass the normal review cycle - with compensating controls such as post-facto review, a second approver, or automatic alerting. Without this, real emergencies create undocumented, unreviewed changes.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 74, cat: "CC8 - Change Management", ref: "CC8.5",
    control: "Deployment runbooks documented for all critical services",
    desc: "Step-by-step deployment runbooks for each critical service. Ensures any engineer can deploy safely and consistently, not just the person who built it. Auditors look for evidence that deployment procedures exist and are followed.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 75, cat: "CC8 - Change Management", ref: "CC8.6",
    control: "Rollback procedures documented and tested",
    desc: "A documented and tested rollback procedure for each critical service. Auditors want evidence that rollbacks have been exercised in practice, not just described in documentation. Include the last tested date and outcome.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 76, cat: "CC8 - Change Management", ref: "CC8.7",
    control: "Dependency and open-source library scanning in pipeline",
    desc: "Automated scanning of third-party libraries for known CVEs as part of the CI pipeline. Snyk, Dependabot, and OWASP Dependency Check are common options. Findings should map to remediation SLAs based on severity.",
    owner: "Engineering", status: "In Progress", notes: "Snyk",
  },
  {
    id: 77, cat: "CC8 - Change Management", ref: "CC8.8",
    control: "Static application security testing (SAST) integrated in CI",
    desc: "Static analysis tools scan source code for security vulnerabilities before merge. Semgrep, CodeQL, and Snyk Code are common options integrated into GitHub Actions. Results should block merges for critical findings or require documented exceptions.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 78, cat: "CC8 - Change Management", ref: "CC8.9",
    control: "Infrastructure changes tracked in code (IaC - Terraform, CDK, etc.)",
    desc: "Infrastructure defined as code makes changes reviewable, auditable, and reproducible. Terraform, AWS CDK, and Pulumi all support version-controlled infrastructure. IaC prevents configuration drift and satisfies change management and audit trail requirements.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 79, cat: "CC8 - Change Management", ref: "CC8.10",
    control: "Change log maintained for significant configuration changes",
    desc: "A log of significant configuration changes to production systems, with who made the change and why. Git commit history, AWS Config, or a change management ticket system all work. Auditors sample changes and verify they were reviewed and documented.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  // CC9 Risk Mitigation
  {
    id: 80, cat: "CC9 - Risk Mitigation", ref: "CC9.1",
    control: "Vendor risk assessment process documented",
    desc: "A documented process for evaluating security risk before onboarding new vendors who handle company or customer data. Should include a security questionnaire, review of their SOC 2 report, and sign-off from a designated owner. Not all vendors need the same depth of review.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 81, cat: "CC9 - Risk Mitigation", ref: "CC9.2",
    control: "Critical vendor SOC 2 reports reviewed annually",
    desc: "Annual review of SOC 2 Type II reports from critical vendors such as AWS, Stripe, and Salesforce. This documents that you have verified their controls are effective during the audit period. Keep the reports on file and record who reviewed them and when.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 82, cat: "CC9 - Risk Mitigation", ref: "CC9.3",
    control: "Data processing agreements (DPAs) signed with all data processors",
    desc: "DPAs must be signed with any vendor that processes personal data on your behalf. Required under GDPR and increasingly expected in enterprise customer contracts. Track which vendors have signed and which are outstanding - three vendors is a manageable starting point.",
    owner: "Legal", status: "Not Started", notes: "3 vendors outstanding",
  },
  {
    id: 83, cat: "CC9 - Risk Mitigation", ref: "CC9.4",
    control: "Business associate agreements (BAAs) in place where applicable",
    desc: "Business Associate Agreements are required when handling Protected Health Information (PHI) under HIPAA. If your product does not touch health data, mark this N/A and document the rationale clearly so auditors understand the scope decision.",
    owner: "Legal", status: "N/A", notes: "Not handling PHI currently",
  },
  {
    id: 84, cat: "CC9 - Risk Mitigation", ref: "CC9.5",
    control: "Cyber liability insurance policy in place",
    desc: "Cyber liability insurance covers costs associated with data breaches, ransomware, and business interruption. Auditors do not require it for SOC 2 itself, but enterprise customers frequently ask for evidence of coverage during vendor due diligence.",
    owner: "Finance", status: "Not Started", notes: "",
  },
  {
    id: 85, cat: "CC9 - Risk Mitigation", ref: "CC9.6",
    control: "Insurance coverage reviewed and updated annually",
    desc: "Annual review of insurance coverage to ensure limits and scope still match the business's risk profile as it grows. Document the review with the insurer and update coverage whenever there are significant changes to data volume, product scope, or revenue.",
    owner: "Finance", status: "Not Started", notes: "",
  },
  {
    id: 86, cat: "CC9 - Risk Mitigation", ref: "CC9.7",
    control: "Third-party contractor access reviewed and time-limited",
    desc: "Contractor and consultant access should be time-limited, scoped to the minimum necessary, and reviewed quarterly. Contractors who have finished an engagement but retain active access are a frequent finding. Use expiring access grants where systems support it.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  // Incident Response
  {
    id: 88, cat: "Incident Response", ref: "IR.1",
    control: "Incident response plan documented and approved by leadership",
    desc: "A written incident response plan that defines what constitutes a security incident, who responds, and the steps to follow from detection through closure. Must be approved by leadership and practically accessible during a real incident - not buried in a wiki.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 89, cat: "Incident Response", ref: "IR.2",
    control: "Incident severity classification defined (P1/P2/P3)",
    desc: "A tiered severity classification (P1 = critical customer impact, P2 = significant degradation, P3 = minor) with defined response time SLAs for each tier. Severity levels drive escalation, customer notification decisions, and post-incident review requirements.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 90, cat: "Incident Response", ref: "IR.3",
    control: "Incident response roles and responsibilities assigned",
    desc: "Named individuals assigned to each role in the IR plan - Incident Commander, Communications Lead, Technical Lead. Assigning roles in advance avoids confusion during high-stress incidents and ensures every function has a clear owner from the start.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 91, cat: "Incident Response", ref: "IR.4",
    control: "Incident tracking and logging system in place",
    desc: "A system for logging and tracking incidents from detection to closure with timestamps. PagerDuty, Jira, or even a shared spreadsheet can work - the key is a complete, timestamped record that auditors can review to verify incidents were managed appropriately.",
    owner: "Engineering", status: "In Progress", notes: "PagerDuty",
  },
  {
    id: 92, cat: "Incident Response", ref: "IR.5",
    control: "Post-incident review (PIR) process defined and practiced",
    desc: "A structured post-incident review (blameless postmortem) process capturing root cause, timeline, and preventive actions. Auditors look for completed PIR documents, not just a defined process. Reviews should be conducted within 5 business days of resolution.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 93, cat: "Incident Response", ref: "IR.6",
    control: "Customer notification process for security incidents defined",
    desc: "A documented process for notifying customers when their data may be affected. Must include who approves the notification, the communication template, the channel, and target timelines. Auditors check that this process has been exercised or tabletop tested.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 94, cat: "Incident Response", ref: "IR.7",
    control: "Regulatory breach notification timeline documented (72h GDPR, etc.)",
    desc: "GDPR requires breach notification to supervisory authorities within 72 hours of discovery. Many US state laws have similar requirements with varying timelines. Document your awareness of applicable timelines and the internal process for meeting them under pressure.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 95, cat: "Incident Response", ref: "IR.8",
    control: "Incident response tabletop exercise conducted annually",
    desc: "An annual tabletop exercise where the team walks through a simulated security incident scenario. Identifies gaps in the plan before a real incident occurs. Document the scenario, participants, gaps identified, and follow-up action items.",
    owner: "Security", status: "Not Started", notes: "",
  },
  {
    id: 96, cat: "Incident Response", ref: "IR.9",
    control: "Contact list for incident response team maintained and tested",
    desc: "A contact list for the incident response team including escalation paths, personal mobile numbers, and backup contacts. Tested at least annually by verifying numbers are current. If primary tools like Slack go down, this list is how the team coordinates.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  // Availability
  {
    id: 97, cat: "Availability", ref: "A1.1",
    control: "Uptime SLA defined and communicated to customers",
    desc: "A formal SLA defining your uptime commitment to customers (e.g. 99.9% monthly uptime). Must be documented in customer contracts and supported by monitoring that can produce evidence of compliance. Enterprise buyers will expect this in procurement.",
    owner: "Founder", status: "Not Started", notes: "",
  },
  {
    id: 98, cat: "Availability", ref: "A1.2",
    control: "Status page in place for real-time uptime communication",
    desc: "A public or customer-accessible status page that shows real-time system status and incident history. Statuspage.io and Better Uptime are common solutions. Builds customer trust and reduces support volume during incidents by giving customers a self-service source of truth.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 99, cat: "Availability", ref: "A1.3",
    control: "Infrastructure designed for high availability (multi-AZ or redundancy)",
    desc: "Infrastructure designed to avoid single points of failure. Multi-AZ deployments in AWS, redundant load balancers, and database read replicas all contribute. Auditors look for architecture documentation and deployment configurations that evidence the HA design.",
    owner: "Engineering", status: "In Progress", notes: "",
  },
  {
    id: 100, cat: "Availability", ref: "A1.4",
    control: "Load testing conducted to validate capacity under peak load",
    desc: "Regular load testing to verify the system performs acceptably under peak traffic conditions. Results should document the test methodology, simulated load levels, and observed system behavior. Untested capacity assumptions are a risk for insurance workloads with enrollment peaks.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 101, cat: "Availability", ref: "A1.5",
    control: "Auto-scaling configured for production workloads",
    desc: "Auto-scaling ensures capacity adjusts automatically to demand without manual intervention. AWS Auto Scaling Groups or ECS service auto-scaling with documented min/max limits and scaling policies. Verify scaling events are monitored and alerts are configured.",
    owner: "Engineering", status: "Done", notes: "AWS Auto Scaling",
  },
  {
    id: 102, cat: "Availability", ref: "A1.6",
    control: "Disaster recovery plan documented with RTO and RPO defined",
    desc: "A documented disaster recovery plan with defined RTO (how quickly you recover) and RPO (maximum acceptable data loss) for each critical system. These objectives must be achievable given your current backup and replication architecture.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 103, cat: "Availability", ref: "A1.7",
    control: "DR plan tested at least annually",
    desc: "At least annual testing of the DR plan - actually restoring from backups in a test environment, not just verifying that backups exist. Document the test scenario, participants, RTO/RPO achieved versus target, and any gaps identified.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 104, cat: "Availability", ref: "A1.8",
    control: "DDoS protection in place (e.g. AWS Shield, Cloudflare)",
    desc: "Protection against volumetric DDoS attacks that could take services offline. AWS Shield Standard provides basic protection at no extra cost. Cloudflare or AWS Shield Advanced offer more sophisticated mitigation for higher-value targets.",
    owner: "Engineering", status: "In Progress", notes: "Cloudflare",
  },
  // Data Protection
  {
    id: 105, cat: "Data Protection", ref: "DP.1",
    control: "Encryption at rest for all sensitive customer data",
    desc: "All sensitive customer data stored at rest must be encrypted using AES-256 or equivalent. RDS and S3 in AWS both support encryption at rest. Auditors verify that encryption is enforced at the resource policy level, not just available as an option.",
    owner: "Engineering", status: "Done", notes: "AES-256 on RDS and S3",
  },
  {
    id: 106, cat: "Data Protection", ref: "DP.2",
    control: "Encryption in transit enforced (TLS 1.2 minimum)",
    desc: "All data in transit must use TLS 1.2 or higher. This applies to API endpoints, internal service-to-service communication, and database connections. TLS 1.0 and 1.1 must be explicitly disabled. Verify with a TLS scanner like SSL Labs.",
    owner: "Engineering", status: "Done", notes: "",
  },
  {
    id: 107, cat: "Data Protection", ref: "DP.3",
    control: "Database encryption keys managed and rotated",
    desc: "Encryption keys must be managed securely with rotation policies defined and enforced. AWS KMS or equivalent provides key management with audit logging and automatic rotation. Key rotation schedules and access to keys should be documented and reviewed.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 108, cat: "Data Protection", ref: "DP.4",
    control: "Customer data backup automated and tested",
    desc: "Automated, regular backups of all customer data with defined retention periods. RDS automated backups, S3 versioning, and dedicated backup tools all qualify. Evidence includes backup job logs showing completion and any failures were addressed.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 109, cat: "Data Protection", ref: "DP.5",
    control: "Backup restoration tested at least quarterly",
    desc: "Backups are only valuable if they can actually be restored. Quarterly restoration tests to a non-production environment with documented outcomes are the auditor expectation. Test results should confirm data integrity and measure recovery time.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 110, cat: "Data Protection", ref: "DP.6",
    control: "Data retention and deletion policy defined",
    desc: "A policy defining how long different types of data are retained and when and how data is deleted. Must align with customer contracts and applicable regulations including GDPR right to erasure and US state privacy laws. Retention periods should be technically enforced.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 111, cat: "Data Protection", ref: "DP.7",
    control: "Customer data deletion process upon contract termination documented",
    desc: "When a customer contract ends, their data must be deleted within a defined timeframe per your agreement. Document the process, who executes it, what systems are covered, and keep deletion confirmation records. Enterprise customers frequently audit this.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 112, cat: "Data Protection", ref: "DP.8",
    control: "Production data not used in development or testing environments",
    desc: "Production data, especially PII, must not be used in development or staging environments. Use synthetic data or anonymized datasets for testing. Violating this is a common finding and creates significant privacy and breach exposure.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 113, cat: "Data Protection", ref: "DP.9",
    control: "Data loss prevention (DLP) tooling or controls in place",
    desc: "Controls or tools that prevent sensitive data from being exfiltrated accidentally or maliciously. Can include email DLP policies, cloud DLP scanning, strict egress controls, or monitoring for large data exports. Controls should be commensurate with the sensitivity of data handled.",
    owner: "Security", status: "Not Started", notes: "",
  },
  // Confidentiality
  {
    id: 114, cat: "Confidentiality", ref: "C1.1",
    control: "Confidential information classification defined and documented",
    desc: "A formal data classification policy defining categories such as Public, Internal, Confidential, and Restricted - with specific handling requirements for each tier. Without this, other confidentiality controls lack a governing framework to reference.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 115, cat: "Confidentiality", ref: "C1.2",
    control: "NDAs executed with all employees and contractors",
    desc: "NDAs signed by all employees and contractors before they access company systems or customer data. DocuSign records with timestamps are the standard evidence auditors request. Verbal agreements or employment contracts without explicit NDA terms are insufficient.",
    owner: "Legal", status: "Done", notes: "",
  },
  {
    id: 116, cat: "Confidentiality", ref: "C1.3",
    control: "NDAs executed with vendors who access confidential data",
    desc: "Vendors who access confidential data or customer information must sign NDAs. Auditors sample vendor contracts to verify NDA coverage. Maintain a tracker of which vendors have signed and which are outstanding - unexecuted NDAs are a common finding.",
    owner: "Legal", status: "In Progress", notes: "2 outstanding",
  },
  {
    id: 117, cat: "Confidentiality", ref: "C1.4",
    control: "Confidential data handling procedures documented",
    desc: "Documented procedures for how confidential data must be handled, stored, and transmitted within the organization. Employees must know what handling requirements apply to each data classification level. Referenced in the information security policy.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 118, cat: "Confidentiality", ref: "C1.5",
    control: "Confidential data sharing with third parties requires approval",
    desc: "Any sharing of confidential data with external parties must go through a documented approval process with a named owner. Prevents unauthorized disclosure and creates an audit trail. Often implemented as a simple email approval or ticket workflow.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 119, cat: "Confidentiality", ref: "C1.6",
    control: "Confidential data disposal procedure documented (e.g. secure wipe)",
    desc: "When confidential data is no longer needed - on devices, paper, or in cloud storage - a secure disposal process must be followed. Includes secure wipe for decommissioned devices and appropriate destruction methods. Disposal should be logged.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 120, cat: "Confidentiality", ref: "C1.7",
    control: "Customer contracts include confidentiality obligations",
    desc: "Customer contracts must include explicit confidentiality obligations from both parties. Standard in most SaaS agreements - verify your contract templates include this language and that it covers both parties' obligations clearly.",
    owner: "Legal", status: "Done", notes: "",
  },
  // Privacy
  {
    id: 121, cat: "Privacy", ref: "P1.1",
    control: "Privacy policy published and accessible to end users",
    desc: "A privacy policy accurately describing what data you collect, how it is used, and who it is shared with. Must be publicly accessible and written in plain language. Enterprise customers review this during procurement and it is often linked from your product.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 122, cat: "Privacy", ref: "P1.2",
    control: "Privacy policy updated to reflect actual data practices",
    desc: "Privacy policies must reflect actual data practices, not aspirational ones. Review and update whenever you add new data collection, third-party integrations, or processing activities. A stale policy that does not match actual practices is worse than a basic accurate one.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 123, cat: "Privacy", ref: "P2.1",
    control: "User consent mechanism for data collection in place",
    desc: "Users must provide informed consent before personal data is collected where required. This includes cookie consent banners, signup flows with terms acceptance, and any opt-in mechanisms. Consent records should be stored with timestamps.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 124, cat: "Privacy", ref: "P3.1",
    control: "Data collection limited to what is necessary for stated purpose",
    desc: "Only collect personal data strictly necessary for the stated product purpose. Collecting more than needed creates unnecessary risk and regulatory exposure. This principle of data minimization is central to GDPR and increasingly expected by enterprise customers.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 125, cat: "Privacy", ref: "P4.1",
    control: "Data use limited to purposes communicated to users",
    desc: "Personal data should only be used for the purposes communicated to users at the time of collection. Using data for new purposes requires updating your privacy policy and potentially re-obtaining consent. Secondary use without disclosure is a regulatory risk.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 126, cat: "Privacy", ref: "P5.1",
    control: "User data access and portability request process documented",
    desc: "A documented process for responding to user requests to access or export their personal data. GDPR requires a response within 30 days. The process should identify where user data lives across all systems and how to compile and deliver it.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 127, cat: "Privacy", ref: "P5.2",
    control: "User data deletion request process documented and tested",
    desc: "A documented and tested process for handling right-to-erasure requests. Includes identifying all locations where the user's data exists across production systems, backups, and third-party processors, and confirming deletion from each.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 128, cat: "Privacy", ref: "P6.1",
    control: "Third-party data sharing disclosed in privacy policy",
    desc: "Any sharing of personal data with third parties must be disclosed in the privacy policy. Includes analytics platforms, advertising tools, and cloud subprocessors. Enterprise customers and GDPR auditors both check that sub-processors are disclosed.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 129, cat: "Privacy", ref: "P7.1",
    control: "Data quality processes in place - inaccurate data corrected on request",
    desc: "Users must be able to request correction of inaccurate personal data. A defined process for reviewing and updating records in response to these requests. Document how requests are received, reviewed, and resolved within a reasonable timeframe.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 130, cat: "Privacy", ref: "P8.1",
    control: "GDPR applicability assessed (EU customers or employees)",
    desc: "If you have customers or employees in the EU, GDPR applies regardless of where Uniblox is incorporated. Document your assessment of GDPR applicability and the specific obligations triggered. Insurtech often involves EU carriers or reinsurers - assess carefully.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 131, cat: "Privacy", ref: "P8.2",
    control: "GDPR DPA agreements in place with all EU data processors",
    desc: "If GDPR applies, Data Processing Agreements must be signed with all vendors processing EU personal data on your behalf. Maintain a sub-processor list and keep DPAs on file. Customers subject to GDPR will audit this during procurement.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 132, cat: "Privacy", ref: "P8.3",
    control: "CCPA applicability assessed (California users)",
    desc: "CCPA applies if you have users in California and meet certain revenue or data volume thresholds. Document your assessment and implement required rights including opt-out of sale, deletion requests, and access requests. US insurtech almost certainly triggers CCPA.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  {
    id: 133, cat: "Privacy", ref: "P8.4",
    control: "Privacy impact assessment (PIA) process defined for new features",
    desc: "A structured Privacy Impact Assessment process for evaluating privacy risks of new product features before launch. Called a DPIA under GDPR when processing is high risk. Embedding privacy review into the product development cycle prevents costly rework.",
    owner: "Legal", status: "Not Started", notes: "",
  },
  // Business Continuity
  {
    id: 134, cat: "Business Continuity", ref: "BC.1",
    control: "Business continuity plan (BCP) documented",
    desc: "A Business Continuity Plan documenting how Uniblox continues operating through a major disruption - natural disaster, key person loss, or infrastructure failure. Must be approved by leadership, stored accessibly, and reviewed at least annually.",
    owner: "Founder", status: "Not Started", notes: "",
  },
  {
    id: 135, cat: "Business Continuity", ref: "BC.2",
    control: "Critical business functions and systems identified",
    desc: "Identify and document which business functions and systems are most critical to Uniblox's operations. This prioritizes recovery efforts and informs where redundancy investment is most valuable. For an early insurtech, this typically means quoting, enrollment, and payments.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 136, cat: "Business Continuity", ref: "BC.3",
    control: "RTO (Recovery Time Objective) defined per critical system",
    desc: "Recovery Time Objective defines the maximum acceptable time for a system to be restored after a failure. Must be defined per system and reflected in architecture and backup decisions. Carrier SLAs for Uniblox's downstream integrations often constrain your own RTO.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 137, cat: "Business Continuity", ref: "BC.4",
    control: "RPO (Recovery Point Objective) defined per critical system",
    desc: "Recovery Point Objective defines the maximum acceptable data loss measured in time. Informs backup frequency and replication strategy for each critical system. For insurance data, regulators may impose minimum RPO requirements - verify with legal.",
    owner: "Engineering", status: "Not Started", notes: "",
  },
  {
    id: 138, cat: "Business Continuity", ref: "BC.5",
    control: "BCP tested and results documented annually",
    desc: "The BCP must be tested at least annually through a tabletop exercise or simulated disruption - not just reviewed. Document the scenario, participants, results, and gaps identified. Test outcomes should feed back into BCP updates.",
    owner: "Ops", status: "Not Started", notes: "",
  },
  {
    id: 139, cat: "Business Continuity", ref: "BC.6",
    control: "Key person dependency risk documented and mitigated",
    desc: "If critical knowledge or relationships are concentrated in one or two individuals, that risk must be documented and actively mitigated through knowledge transfer, documentation, cross-training, and succession planning. Auditors ask about this for founder-led companies.",
    owner: "Founder", status: "Not Started", notes: "",
  },
  {
    id: 140, cat: "Business Continuity", ref: "BC.7",
    control: "Alternate communication channels documented if primary tools are down",
    desc: "If Slack or email go down during an incident, the team needs pre-agreed backup channels. Document alternatives such as SMS, WhatsApp group, or a phone tree - and ensure every team member knows them. Test backup channels at least annually.",
    owner: "Ops", status: "Not Started", notes: "",
  },
];

const CATS = ["All", ...Array.from(new Set(ALL.map((c) => c.cat)))];

export default function Page() {
  const [controls, setControls] = useState<Control[]>(ALL);
  const [activeCat, setActiveCat] = useState("All");
  const [editNote, setEditNote] = useState<number | null>(null);
  const [noteVal, setNoteVal] = useState("");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [popup, setPopup] = useState<Control | null>(null);

  // Theme
  const t = {
    bg:         dark ? "#0f172a" : "#ffffff",
    surface:    dark ? "#1e293b" : "#f9fafb",
    border:     dark ? "#334155" : "#e5e7eb",
    borderFaint:dark ? "#1e293b" : "#f3f4f6",
    text:       dark ? "#f1f5f9" : "#111827",
    muted:      dark ? "#94a3b8" : "#6b7280",
    dimmer:     dark ? "#64748b" : "#9ca3af",
    inputBg:    dark ? "#1e293b" : "#ffffff",
    inputText:  dark ? "#f1f5f9" : "#111827",
    selectBg:   dark ? "#0f172a" : "#ffffff",
  };

  const filtered = useMemo(() => {
    let r = activeCat === "All" ? controls : controls.filter((c) => c.cat === activeCat);
    if (search.trim())
      r = r.filter(
        (c) =>
          c.control.toLowerCase().includes(search.toLowerCase()) ||
          c.cat.toLowerCase().includes(search.toLowerCase()) ||
          c.ref.toLowerCase().includes(search.toLowerCase())
      );
    return r;
  }, [controls, activeCat, search]);

  const total = controls.length;
  const done = controls.filter((c) => c.status === "Done").length;
  const inProg = controls.filter((c) => c.status === "In Progress").length;
  const na = controls.filter((c) => c.status === "N/A").length;
  const notStarted = total - done - inProg - na;
  const pct = Math.round((done / total) * 100);

  function upd(id: number, field: keyof Control, val: string) {
    setControls((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
    if (popup && popup.id === id) {
      setPopup((prev) => prev ? { ...prev, [field]: val } : prev);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "1.5rem 2rem", background: t.bg, minHeight: "100vh", transition: "background 0.2s, color 0.2s" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="/uniblox-logo.png" alt="Uniblox" style={{ width: 36, height: 36, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: t.dimmer, textTransform: "uppercase", margin: "0 0 2px" }}>
              Uniblox - Internal
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 2px", color: t.text }}>SOC 2 Readiness Tracker</h1>
            <p style={{ fontSize: 13, color: t.muted, margin: 0 }}>
              Trust Services Criteria - Security + optional categories - {total} controls
            </p>
          </div>
        </div>
        {/* Dark mode toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8,
            padding: "6px 12px", cursor: "pointer", fontSize: 13, color: t.muted,
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
          }}
        >
          {dark ? "☀ Light" : "☾ Dark"}
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: "1.5rem" }}>
        {(
          [
            ["Total", total, t.text],
            ["Done", done, dark ? "#86efac" : "#3b6d11"],
            ["In progress", inProg, dark ? "#fbbf24" : "#854f0b"],
            ["Not started", notStarted, t.muted],
            ["N/A", na, dark ? "#60a5fa" : "#185fa5"],
          ] as [string, number, string][]
        ).map(([label, val, col]) => (
          <div key={label} style={{ background: t.surface, borderRadius: 8, padding: "10px 14px", border: `1px solid ${t.border}` }}>
            <p style={{ fontSize: 11, color: t.muted, margin: "0 0 2px" }}>{label}</p>
            <p style={{ fontSize: 22, fontWeight: 600, margin: 0, color: col }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 13, color: t.muted }}>Completion</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: t.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#639922", borderRadius: 99, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Search */}
      <input
        placeholder="Search controls, categories, or ref codes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%", marginBottom: "0.75rem", fontSize: 13,
          padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`,
          boxSizing: "border-box", outline: "none",
          background: t.inputBg, color: t.inputText,
        }}
      />

      {/* Category filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "1rem" }}>
        {CATS.map((cat) => {
          const count = cat === "All" ? total : controls.filter((c) => c.cat === cat).length;
          const catDone = cat === "All" ? done : controls.filter((c) => c.cat === cat && c.status === "Done").length;
          const active = activeCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 99, cursor: "pointer",
                border: active ? `1.5px solid ${dark ? "#60a5fa" : "#111827"}` : `1px solid ${t.border}`,
                background: active ? (dark ? "#1d4ed8" : "#111827") : t.surface,
                color: active ? "#fff" : t.muted,
                fontWeight: active ? 600 : 400,
              }}
            >
              {cat === "All" ? `All (${total})` : `${cat.split("-")[0].trim()} (${catDone}/${count})`}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "33%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "29%" }} />
          </colgroup>
          <thead>
            <tr style={{ background: t.surface }}>
              {["Ref", "Control", "Owner", "Status", "Notes"].map((h) => (
                <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontWeight: 500, fontSize: 12, color: t.muted, borderBottom: `1px solid ${t.border}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: t.dimmer, fontSize: 13 }}>
                  No controls match your search.
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => {
                const ss = statusStyle(c.status, dark);
                return (
                  <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${t.borderFaint}` : "none", background: t.bg }}>
                    <td style={{ padding: "8px 10px", color: t.dimmer, fontFamily: "monospace", fontSize: 11 }}>{c.ref}</td>
                    <td style={{ padding: "8px 10px", lineHeight: 1.5, fontSize: 13 }}>
                      <span
                        onClick={() => setPopup(controls.find((x) => x.id === c.id) ?? c)}
                        style={{ color: dark ? "#93c5fd" : "#1d4ed8", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}
                        title="Click for more detail"
                      >
                        {c.control}
                      </span>
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <select
                        value={c.owner}
                        onChange={(e) => upd(c.id, "owner", e.target.value)}
                        style={{ fontSize: 12, padding: "3px 5px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.selectBg, color: t.text, width: "100%" }}
                      >
                        {OWNERS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <select
                        value={c.status}
                        onChange={(e) => upd(c.id, "status", e.target.value)}
                        style={{ fontSize: 11, padding: "3px 6px", borderRadius: 99, border: "none", fontWeight: 600, width: "100%", cursor: "pointer", ...ss }}
                      >
                        {STATUSES.map((st) => <option key={st}>{st}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      {editNote === c.id ? (
                        <input
                          autoFocus
                          value={noteVal}
                          onChange={(e) => setNoteVal(e.target.value)}
                          onBlur={() => { upd(c.id, "notes", noteVal); setEditNote(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { upd(c.id, "notes", noteVal); setEditNote(null); } }}
                          style={{ fontSize: 12, padding: "3px 6px", width: "100%", borderRadius: 6, border: `1px solid ${t.border}`, boxSizing: "border-box", background: t.inputBg, color: t.inputText }}
                        />
                      ) : (
                        <span
                          onClick={() => { setEditNote(c.id); setNoteVal(c.notes); }}
                          style={{ fontSize: 12, color: c.notes ? t.muted : t.dimmer, cursor: "text", display: "block", minHeight: 18 }}
                        >
                          {c.notes || "Add note..."}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: t.dimmer, marginTop: "0.75rem", textAlign: "right" }}>
        {filtered.length} of {total} controls shown - click any control name for details
      </p>

      {/* Detail popup */}
      {popup && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setPopup(null); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
          }}
        >
          <div style={{
            background: dark ? "#1e293b" : "#ffffff", borderRadius: 12, maxWidth: 540, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", border: `1px solid ${t.border}`, overflow: "hidden",
          }}>
            {/* Popup header */}
            <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, fontFamily: "monospace", color: t.dimmer, display: "block", marginBottom: 4 }}>{popup.ref}</span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: t.text, margin: "0 0 4px", lineHeight: 1.4 }}>{popup.control}</p>
                  <span style={{ fontSize: 11, color: t.muted }}>{popup.cat}</span>
                </div>
                <button
                  onClick={() => setPopup(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: t.muted, fontSize: 20, lineHeight: 1, padding: 0, flexShrink: 0, marginTop: 2 }}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Popup body */}
            <div style={{ padding: "16px 20px 20px" }}>
              <p style={{ fontSize: 13, color: t.muted, lineHeight: 1.65, margin: "0 0 16px" }}>{popup.desc}</p>

              {/* Inline controls inside popup */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: t.dimmer, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Owner</p>
                  <select
                    value={popup.owner}
                    onChange={(e) => upd(popup.id, "owner", e.target.value)}
                    style={{ fontSize: 13, padding: "5px 8px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.selectBg, color: t.text, width: "100%" }}
                  >
                    {OWNERS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: t.dimmer, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</p>
                  <select
                    value={popup.status}
                    onChange={(e) => upd(popup.id, "status", e.target.value)}
                    style={{ fontSize: 12, padding: "5px 8px", borderRadius: 99, border: "none", fontWeight: 600, width: "100%", cursor: "pointer", ...statusStyle(popup.status, dark) }}
                  >
                    {STATUSES.map((st) => <option key={st}>{st}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: t.dimmer, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes</p>
                <textarea
                  value={popup.notes}
                  onChange={(e) => upd(popup.id, "notes", e.target.value)}
                  placeholder="Add a note..."
                  rows={2}
                  style={{ fontSize: 12, padding: "6px 8px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.inputBg, color: t.inputText, width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
