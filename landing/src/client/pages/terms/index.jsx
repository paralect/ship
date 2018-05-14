import React, { PureComponent } from 'react';
import classnames from 'classnames';

import PrivacyLayout from '~/layouts/privacy';

import styles from './styles.pcss';

export default class Signin extends PureComponent {
  render(props) {
    return (
      <PrivacyLayout>
        <h1>Ship Subsription Terms of Service</h1>

        <p>Last modified: May, 04, 2018</p>

        <p>
          This Ship Subscription Terms of Service (&quot;Agreement&quot;) is
          entered into by and between the Ship entity set forth below
          (&quot;Ship&quot;) and the entity or person (other than a legal entity
          or individual registered and/or residing in Belarus) placing an order
          for or accessing any Services (&quot;Customer&quot; or &quot;you&quot;).
          If you are accessing or using the Services on behalf of your company,
          you represent that you are authorized to accept this Agreement on behalf
          of your company, and all references to &quot;you&quot; or
          &quot;Customer&quot; reference your company.
        </p>

        <p>
          This Agreement permits Customer to purchase subscriptions to online
          software-as-a-service products and other services from Ship pursuant
          to any Ship ordering documents, online registration, order descriptions
          or order confirmations referencing this Agreement (&quot;Order Form(s)&quot;)
          and sets forth the basic terms and conditions under which those products
          and services will be delivered. This Agreement will govern Customer&apos;s
          initial purchase on the Effective Date as well as any future purchases
          made by Customer that reference this Agreement.
        </p>

        <p>
          The &quot;Effective Date&quot; of this Agreement is the date which is
          the earlier of (a) Customer&apos;s initial access to any Service
          (as defined below) through any online provisioning, registration or
          order process or (b) the effective date of the first Order Form
          referencing this Agreement.
        </p>

        <p>
          As used in this Agreement, &quot;Ship&quot; means PARALECT LLC, a
          company incorporated and registered in Belarus with registration
          number 191343485 whose registered office is at 11-4 Kulman Street,
          Minsk, 220100, Belarus.
        </p>

        <h2>Modifications to this Agreement</h2>

        <p>
          From time to time, Ship may modify this Agreement. Unless otherwise
          specified by Ship, changes become effective for Customer upon renewal
          of Customer&apos;s current Subscription Term (as defined below) or entry
          into a new Order Form. Ship will use reasonable efforts to notify
          Customer of the changes through communications via Customer&apos;s account,
          email, website https://www.ship-demo.paralect.com or other means.
          Customer may be required to click to accept or otherwise agree to the
          modified Agreement before renewing a Subscription Term or entering into
          a new Order Form, and in any event continued use of the Services after
          the updated version of this Agreement goes into effect will constitute
          Customer&apos;s acceptance of such updated version. If Ship specifies
          that changes to the Agreement will take effect prior to Customer&apos;s
          next renewal or order (such as for legal compliance or product change
          reasons) and Customer objects to such changes, Customer may terminate
          the applicable Subscription Term and receive as its sole remedy a
          refund of any fees Customer has pre-paid for use of the applicable
          Services for the terminated portion of the Subscription Term.
        </p>

        <p className={classnames(styles.alert, styles.transformUppercase)}>
          By indicating your acceptance of this agreement or accessing or using
          any services, you are agreeing to be bound by all terms, conditions,
          and notices contained or referenced in this agreement. By acceptance
          of this agreement you represent and warrant that you are not a legal
          entity or individual registered and/or residing in belarus. If you are
          not eligible customer or do not agree to this agreement, please do not
          use any services. For clarity, each party expressly agrees that this
          agreement is legally binding upon it.this agreement contains mandatory
          arbitration provisions that require the use of arbitration to resolve
          disputes, rather than jury trials. Please read it carefully.
        </p>

        <h2>1. DEFINITIONS</h2>

        <p>
          &quot;Contractor&quot; means an independent contractor or consultant
          who is not a competitor of Ship.
        </p>

        <p>
          &quot;Customer Data&quot; means any data of any type that is submitted
          to the Services by or on behalf of Customer, including without
          limitation: (a) data submitted, uploaded or imported to the Services by
          Customer (including from Third Party Platforms) and (b) data provided
          by or about People (including chat and message logs) that are collected
          from the Customer Properties using the Services.
        </p>

        <p>
          &quot;Customer Properties&quot; means Customer&apos;s websites, apps,
          or other offerings owned and operated by (or for the benefit of) Customer
          through which Customer uses the Services to communicate with People.
        </p>

        <p>
          &quot;Dashboard&quot; means Ship&apos;s user interface for accessing
          and administering the Services that Customer may access via the web
          or the Ship Apps.
        </p>

        <p>
          &quot;Documentation&quot; means the technical user documentation
          provided with the Services.
        </p>

        <p>
          &quot;Feedback&quot; means comments, questions, suggestions or other
          feedback relating to any Ship product or service.
        </p>

        <p>
          &quot;Ship App&quot; means any mobile application or desktop client
          software included in the applicable Service that is made available
          by Ship.
        </p>

        <p>
          &quot;Ship Code&quot; means certain JavaScript code, software
          development kits (SDKs) or other code provided by Ship for deployment
          on Customer Properties.
        </p>

        <p>
          &quot;Law&quot; means all applicable laws, regulations and conventions,
          including, without limitation, those related to data privacy and data
          transfer, international communications, and the exportation of technical
          or personal data.
        </p>

        <p>
          &quot;People&quot; (in the singular, &quot;Person&quot;) means Customer&apos;s
          end user customers, potential customers, and other users of and visitors
          to the Customer Properties.
        </p>

        <p>
          &quot;Permitted User&quot; means an employee or Contractor of Customer
          who is authorized to access the Service.
        </p>

        <p>
          Sensitive Personal Information&quot; means any of the following: (i)
          credit, debit or other payment card data subject to the Payment Card
          Industry Data Security Standards (&quot;PCI DSS&quot;); (ii) patient,
          medical or other protected health information regulated by Health Insurance
          Portability and Accountability Act (HIPAA&quot;); or (iii) any other
          personal data of an EU citizen deemed to be in a &quot;special category&quot;
          (as identified in EU Data Protection Directive 95/46/EC or any successor
          directive or regulation).
        </p>

        <p>
          &quot;Services&quot; means Ship&apos;s proprietary software-as-a-service
          solution(s), including the Dashboard, Ship application programming
          interfaces (APIs), Ship Code and Ship Apps, as described in the
          applicable Order Form.
        </p>

        <p>
          &quot;Taxes&quot; means any value-added, withholding, or similar taxes
          or levies, whether domestic or foreign, other than taxes based on the
          income of Ship.
        </p>

        <p>
          &quot;Third-Party Platform&quot; means any software, software-as-a-service,
          data sources or other products or services not provided by Ship that
          are integrated with the Services as described in the Documentation.
        </p>

        <h2>2. SHIP SERVICES</h2>

        <p>
          <span className={styles.chapter}>
            2.1. Services Overview.
          </span>
          Ship&apos;s Services are a suite of messaging software-as-a-service solutions
          offered through a single platform. The Services are designed to enable
          Customer to manage communications between users and to provide a
          Dashboard for accessing and managing Customer Data regarding those People.
          Customer may import and export Customer Data between the Services and
          certain Third-Party Platforms through supported integrations. The Services
          also include Ship Code deployed on Customer Properties to enable live
          chat and messaging functionality.
        </p>

        <p>
          <span className={styles.chapter}>
            2.2. Provision of Services.
          </span>
          Each Service is provided on a subscription basis for a set term designated
          on the Order Form (each, a &quot;Subscription Term&quot;). Ship may also
          offer Professional Services (as defined in Section 10) related to certain
          Services. Customer will purchase and Ship will provide the specific
          Services and related Professional Services (if any) as specified in the
          applicable Order Form.
        </p>

        <p>
          <span className={styles.chapter}>
            2.3. Access to Services.
          </span>
          Customer may access and use the Services solely for its own benefit and
          in accordance with the terms and conditions of this Agreement, the
          Documentation and any scope of use restrictions designated in the
          applicable Order Form (including without limitation the number of People
          tracked). Use of and access to the Services is permitted only by
          Permitted Users. If Customer is given API keys or passwords to access
          the Services on Ship&apos;s systems, Customer will require that all
          Permitted Users keep API keys, user ID and password information strictly
          confidential and not share such information with any unauthorized person.
          User IDs are granted to individual, named persons and may not be shared.
          If Customer is accessing the Services using credentials provided by a
          third party (e.g., Google), then Customer will comply with all applicable
          terms and conditions of such third party regarding provisioning and use
          of such credentials. Customer will be responsible for any and all actions
          taken using Customer&apos;s accounts and passwords. If any Permitted
          User who has access to a user ID is no longer an employee (or Contractor,
          as set forth below) of Customer, then Customer will immediately delete
          such user ID and otherwise terminate such Permitted User&apos;s access
          to the Service. The right to use the Services includes the right to
          deploy Ship Code on Customer Properties in order to enable messaging,
          chat and similar functionality and to collect Customer Data for use
          with the Services as further described below.
        </p>

        <p>
          <span className={styles.chapter}>
            2.4. Ship Apps.
          </span>
          To the extent Ship provides Ship Apps for use with the Services, subject
          to all of the terms and conditions of this Agreement, Ship grants to
          Customer a limited, non-transferable, non-sublicensable, non-exclusive
          license during any applicable Subscription Term to use the object code
          form of the Ship Apps internally, but only in connection with
          Customer&apos;s use of the Service and otherwise in accordance with the
          Documentation and this Agreement.
        </p>

        <p>
          <span className={styles.chapter}>
            2.5. Deployment of Ship Code.
          </span>
          Subject to all of the terms and conditions of this Agreement, Ship
          grants to Customer a limited, non-transferable, non-sublicensable,
          non-exclusive license during any applicable Subscription Term to copy
          the Ship Code in the form provided by Ship on Customer Properties solely
          to support Customer&apos;s use of the Service and otherwise in
          accordance with the Documentation and this Agreement. Customer must
          implement Ship Code on the Customer Properties in order to enable features
          of the Services. Customer will implement all Ship Code in strict
          accordance with the Documentation and other instructions provided by
          Ship. Customer acknowledges that any changes made to the Customer
          Properties after initial implementation of Ship Code may cause the
          Services to cease working or function improperly and that Ship will
          have no responsibility for the impact of any such Customer changes.
        </p>

        <p>
          <span className={styles.chapter}>
            2.6. Contractors and Affiliates.
          </span>
          Customer may permit its Contractors and its Affiliates&apos; employees
          and Contractors to serve as Permitted Users, provided Customer remains
          responsible for compliance by such individuals with all of the terms
          and conditions of this Agreement, and any use of the Services by such
          individuals is for the sole benefit of Customer.
        </p>

        <p>
          <span className={styles.chapter}>
            2.7. General Restrictions.
          </span>
          Customer will not (and will not permit any third party to): (a) rent,
          lease, provide access to or sublicense the Services to a third party;
          (b) use the Services to provide, or incorporate the Services into, any
          product or service provided to a third party; (c) reverse engineer,
          decompile, disassemble, or otherwise seek to obtain the source code or
          non-public APIs to the Services, except to the extent expressly permitted
          by applicable Law (and then only upon advance notice to Ship); (d) copy
          or modify the Services or any Documentation, or create any derivative
          work from any of the foregoing; (e) remove or obscure any proprietary
          or other notices contained in the Services (including without limitation
          (i) the &quot;We run on Ship&quot; designation that may appear as part
          of the deployment of the Services on Customer Properties and (ii) notices
          on any reports or data printed from the Services); or (f) publicly
          disseminate information regarding the performance of the Services.
        </p>

        <p>
          <span className={styles.chapter}>
            2.8. Ship APIs.
          </span>
          If Ship makes access to any APIs available as part of the Services,
          Ship reserves the right to place limits on access to such APIs (e.g.,
          limits on numbers of calls or requests). Further, Ship may monitor
          Customer&apos;s usage of such APIs and limit the number of calls or
          requests Customer may make if Ship believes that Customer&apos;s usage
          is in breach of this Agreement or may negatively affect the Services
          (or otherwise impose liability on Ship).
        </p>

        <h2>3. CUSTOMER DATA</h2>

        <p>
          <span className={styles.chapter}>
            3.1. Rights in Customer Data.
          </span>
          As between the parties, Customer will retain all right, title and
          interest (including any and all intellectual property rights) in and
          to the Customer Data as provided to Ship. Subject to the terms of this
          Agreement, Customer hereby grants to Ship a non-exclusive, worldwide,
          royalty-free rightto use, copy, store, transmit, modify, create
          derivative works of and display the Customer Data solely to the extent
          necessary to provide the Services to Customer.
        </p>

        <p>
          <span className={styles.chapter}>
            3.2. Storage of Customer Data.
          </span>
          Ship does not provide an archiving service. Ship agrees only that it
          will not intentionally delete any Customer Data from any Service prior
          to termination of Customer&apos;s applicable Subscription Term. Ship
          expressly disclaims all other obligations with respect to storage.
        </p>

        <p>
          <span className={styles.chapter}>
            3.3. Customer Obligations.
          </span>
        </p>

        <p>
          a) In General. Customer is solely responsible for the accuracy, content
          and legality of all Customer Data. Customer represents and warrants to
          Ship that Customer has all necessary rights, consents and permissions
          to collect, share and use all Customer Data as contemplated in this
          Agreement (including granting Ship the rights in Section 3.1 (Rights
          in Customer Data)) and that no Customer Data will violate or infringe
          (i) any third party intellectual property, publicity, privacy or other
          rights, (ii) any Laws, or (iii) any terms of service, privacy policies
          or other agreements governing the Customer Properties or Customer&apos;s
          accounts with any Third-Party Platforms. Customer will be fully responsible
          for any Customer Data submitted to the Services by any Person as if it
          was submitted by Customer.
        </p>

        <p>
          b) No Sensitive Personal Information. Customer specifically agrees not
          to use the Services to collect, store, process or transmit any Sensitive
          Personal Information. Customer acknowledges that Ship is not a
          Business Associate or subcontractor (as those terms are defined in HIPAA)
          or a payment card processor and that the Services are neither HIPAA nor
          PCI DSS compliant. Ship will have no liability under this Agreement for
          Sensitive Personal Information, notwithstanding anything to the
          contrary herein.
        </p>

        <p>
          c) Compliance with Laws. Customer agrees to comply with all applicable
          Laws in its use of the Services. Without limiting the generality of the
          foregoing, Customer will not engage in any unsolicited advertising,
          marketing, or other activities using the Services, including without
          limitation any activities that violate the Telephone Consumer Protection
          Act of 1991, CAN-SPAM Act of 2003 or any other anti-spam laws and
          regulations.
        </p>

        <p>
          d) Disclosures on Customer Properties. Customer acknowledges that the
          Ship Code causes a unique cookie ID to be associated with each Person
          who accesses the Customer Properties, which cookie ID enables Ship to
          provide the Services. Customer will include on each Customer Property
          a link to its privacy policy that discloses Customer&apos;s use of third
          party tracking technology to collect data about People as described in
          this Agreement. Customer&apos;s privacy policy must disclose how, and
          for what purposes, the data collected through Ship Code will be used
          or shared with Ship as part of the Services. Customer must also provide
          People with clear and comprehensive information about the storing and
          accessing of cookies or other information on the Peoples&apos; devices
          where such activity occurs in connection with the Services and as
          required by applicable Laws. For clarity, as between Customer and Ship,
          Customer will be solely responsible for obtaining the necessary clearances,
          consents and approvals from People under all applicable Laws.
        </p>

        <p>
          <span className={styles.chapter}>
            3.4. Indemnification by Customer.
          </span>
          Customer will indemnify, defend and hold harmless Ship from and against
          any and all claims, costs, damages, losses, liabilities and expenses
          (including reasonable attorneys&apos; fees and costs) arising out of or
          in connection with any claim arising from or relating to any Customer
          Data or breach or alleged breach by Customer of Section 3.3 (Customer
          Obligations). This indemnification obligation is subject to Customer
          receiving (i) prompt written notice of such claim (but in any event
          notice in sufficient time for Customer to respond without prejudice);
          (ii) the exclusive right to control and direct the investigation,
          defense, or settlement of such claim; and (iii) all necessary
          cooperation of Ship at Customer&apos;s expense. Notwithstanding the
          foregoing sentence, (a) Ship may participate in the defense of any claim
          by counsel of its own choosing, at its cost and expense and (b) Customer
          will not settle any claim without Ship&apos;s prior written consent,
          unless the settlement fully and unconditionally releases Ship and does
          not require Ship to pay any amount, take any action, or admit any liability.
        </p>

        <p>
          <span className={styles.chapter}>
            3.5. Aggregated Anonymous Data.
          </span>
          Not with standing anything to the contrary herein, Customer agrees that
          Ship may obtain and aggregate technical and other data about Customer&apos;s
          use of the Services that is non-personally identifiable with respect to
          Customer (&quot;Aggregated Anonymous Data&quot;), and Ship may use the
          Aggregated Anonymous Data to analyze, improve, support and operate the
          Services and otherwise for any business purpose during and after the
          term of this Agreement, including without limitation to generate industry
          benchmark or best practice guidance, recommendations or similar reports
          for distribution to and consumption by Customer and other Ship customers.
          For clarity, this Section 3.5 does not give Ship the right to identify
          Customer as the source of any Aggregated Anonymous Data.
        </p>

        <h2>4. SECURITY</h2>

        <p>
          <span className={styles.chapter}>4.1.</span>
          Ship agrees to use commercially reasonable technical and organizational
          measures designed to prevent unauthorized access, use, alteration or
          disclosure of any Service or Customer Data. However, Ship will have no
          responsibility for errors in transmission, unauthorized third-party
          access or other causes beyond Ship&apos;s control.
        </p>

        <h2>5. THIRD-PARTY PLATFORMS</h2>

        <p>
          <span className={styles.chapter}>5.1.</span>
          The Services may support integrations with certain Third-Party Platforms.
          In order for the Services to communicate with such Third-Party Platforms,
          Customer may be required to input credentials in order for the Services
          to access and receive relevant information from such Third-Party
          Platforms. By enabling use of the Services with any Third-Party Platform,
          Customer authorizes Ship to access Customer&apos;s accounts with such
          Third-Party Platform for the purposes described in this Agreement.
          Customer is solely responsible for complying with any relevant terms
          and conditions of the Third-Party Platforms and maintaining appropriate
          accounts in good standing with the providers of the Third-Party Platforms.
          Customer acknowledges and agrees that Ship has no responsibility or
          liability for any Third-Party Platform or any Customer Data exported
          to a Third-Party Platform. Ship does not guarantee that the Services
          will maintain integrations with any Third-Party Platform and Ship may
          disable integrations of the Services with any Third-Party Platform at
          any time with or without notice to Customer. For clarity, this Agreement
          governs Customer&apos;s use of and access to the Services, even if
          accessed through an integration with a Third-Party Platform.
        </p>

        <h2>6. OWNERSHIP</h2>

        <p>
          <span className={styles.chapter}>6.1.</span>
          Ship Technology. This is a subscription agreement for access to and use
          of the Services. Customer acknowledges that it is obtaining only a
          limited right to the Services and that irrespective of any use of the
          words &quot;purchase&quot;, &quot;sale&quot; or like terms in this
          Agreement no ownership rights are being conveyed to Customer under
          this Agreement. Customer agrees that Ship or its suppliers retain all
          right, title and interest (including all patent, copyright, trademark,
          trade secret and other intellectual property rights) in and to the
          Services and all Documentation, professional services deliverables and
          any and all related and underlying technology and documentation and
          any derivative works, modifications or improvements of any of the
          foregoing, including as may incorporate Feedback (collectively,
          &quot;Ship Technology&quot;). Except as expressly set forth in this
          Agreement, no rights in any Ship Technology are granted to Customer.
          Further, Customer acknowledges that the Services are offered as an
          on-line, hosted solution, and that Customer has no right to obtain a
          copy of any of the Services, except for Ship Code and the Ship Apps in
          the format provided by Ship.
        </p>

        <p>
          <span className={styles.chapter}>6.2. Feedback.</span>
          Customer, from time to time, may submit Feedback to Ship. Ship may
          freely use or exploit Feedback in connection with any of its products
          or services.
        </p>

        <h2>7. SUBSCRIPTION TERM, FEES & PAYMENT</h2>

        <p>
          <span className={styles.chapter}>
            7.1. Subscription Term and Renewals.
          </span>
          Unless otherwise specified on the applicable Order Form, each Subscription
          Term will automatically renew for additional twelve month periods unless
          either party gives the other written notice of termination at least
          thirty (30) days prior to expiration of the then-current Subscription Term.
        </p>

        <p>
          <span className={styles.chapter}>
            7.2. Fees and Payment.
          </span>
          All fees are as set forth in the applicable Order Form and will be
          paid by Customer within thirty (30) days of invoice, unless (a) Customer
          is paying via Credit Card (as defined below) or (b) otherwise specified
          in the applicable Order Form. Except as expressly set forth in Section 9
          (Limited Warranty) and Section 14 (Indemnification), all fees are
          non-refundable. The rates in the Order Form are valid for the initial
          twelve (12) month period of each Subscription Term and thereafter may
          be subject to an automatic adjustment increase of up to ten percent (50%)
          per year. Customer is responsible for paying all Taxes, and all Taxes
          are excluded from any fees set forth in the applicable Order Form. If
          Customer is required by Law to withhold any Taxes from Customer&apos;s
          payment, the fees payable by Customer will be increased as necessary so
          that after making any required withholdings, Ship receives and retains
          (free from any liability for payment of Taxes) an amount equal to the
          amount it would have received had no such withholdings been made. Any
          late payments will be subject to a service charge equal to 1.5% per
          month of the amount due or the maximum amount allowed by Law, whichever
          is less.
        </p>

        <p>
          <span className={styles.chapter}>
            7.3. Payment Via Credit Card.
          </span>
          If you are purchasing the Services via credit card, debit card or other
          payment card (&quot;Credit Card&quot;), the following terms apply:
        </p>

        <ol>
          <li>
            <span className={styles.listTitle}>
              Recurring Billing Authorization.
            </span>
            By providing Credit Card information and agreeing to purchase any
            Services, Customer hereby authorizes Ship (or its designee) to
            automatically charge Customer&apos;s Credit Card on the same date of
            each calendar month (or the closest prior date, if there are fewer
            days in a particular month) during the Subscription Term for all
            fees accrued as of that date (if any) in accordance with the applicable
            Order Form. Customer acknowledges and agrees that the amount billed
            and charged each month may vary depending on Customer&apos;s use of
            the Services and may include subscription fees for the remainder of
            Customer&apos;s applicable billing period and overage fees for the
            prior month.
          </li>

          <li>
            <span className={styles.listTitle}>
              Foreign Transaction Fees.
            </span>
            Customer acknowledges that for certain Credit Cards, the issuer of
            Customer&apos;s Credit Card may charge a foreign transaction fee or
            other charges.
          </li>

          <li>
            <span className={styles.listTitle}>Invalid Payment.</span>
            If a payment is not successfully settled due to expiration of a Credit
            Card, insufficient funds, or otherwise, Customer remains responsible
            for any amounts not remitted to Ship and Ship may, in its sole
            discretion, either (i) invoice Customer directly for the deficient
            amount, (ii) continue billing the Credit Card once it has been
            updated by Customer (if applicable) or (iii) terminate this Agreement.
          </li>

          <li>
            <span className={styles.listTitle}>
              Changing Credit Card Information.
            </span>
            At any time, Customer may change its Credit Card information by
            entering updated Credit Card information via the &quot;Billing&quot;
            page.
          </li>

          <li>
            <span className={styles.listTitle}>
              Termination of Recurring Billing.
            </span>
            In addition to any termination rights set forth in this Agreement,
            Customer may terminate the Subscription Term by sending Ship notice
            of non-renewal to support@Ship.com in accordance with Section 7.1
            (Subscription Term and Renewals) or, if Customer&apos;s Subscription
            Term is on a monthly basis (or if otherwise permitted by Ship), by
            terminating via the &quot;Billing&quot; page, with termination
            effective at the end of the current Subscription Term.As set forth
            in Section 2.9 (Trial Subscriptions), if Customer does not enter
            into a paid Subscription Term following a Trial Period, this Agreement
            and Customer&apos;s right to access and use the Services will
            terminate at the end of the Trial Period and Customer&apos;s Credit
            Card will not be charged.
          </li>

          <li>
            <span className={styles.listTitle}>
              Payment of Outstanding Fees.
            </span>
            Upon any termination or expiration of the Subscription Term, Ship
            will charge Customer&apos;s Credit Card (or invoice Customer directly)
            for any outstanding fees for Customer&apos;s use of the Services
            during the Subscription Term, after which Ship will not charge
            Customer&apos;s Credit Card for any additional fees.
          </li>
        </ol>

        <p>
          <span className={styles.chapter}>
            7.4. Suspension of Service.
          </span>
          If Customer&apos;s account is thirty (30) days or more overdue, in
          addition to any of its other rights or remedies (including but not
          limited to any termination rights set forth herein), Ship reserves the
          right to suspend Customer&apos;s access to the applicable Service
          (and any related services) without liability to Customer until such
          amounts are paid in full. Ship also reserves the right to suspend
          Customer&apos;s access to the Services.
        </p>

        <h2>8. TERM AND TERMINATION</h2>

        <p>
          <span className={styles.chapter}>8.1. Term.</span>
          This Agreement is effective as of the Effective Date and expires on
          the date of expiration or termination of all Subscription Terms.
        </p>

        <p>
          <span className={styles.chapter}>8.2. Termination for Cause.</span>
          Either party may terminate this Agreement (including all related Order
          Forms) if the other party (a) fails to cure any material breach of this
          Agreement (including a failure to pay fees) within thirty (30) days
          after written notice; (b) ceases operation without a successor; or (c)
          seeks protection under any bankruptcy, receivership, trust deed,
          creditors&apos; arrangement, composition, or comparable proceeding, or
          if any such proceeding is instituted against that party (and not
          dismissed within sixty (60) days thereafter).
        </p>

        <p>
          <span className={styles.chapter}>8.3. Effect of Termination.</span>
          Upon any expiration or termination of this Agreement, Customer will
          immediately cease any and all use of and access to all Services
          (including any and all related Ship Technology) and delete (or, at
          Ship&apos;s request, return) any and all copies of the Documentation,
          any Ship passwords or access codes and any other Ship Confidential
          Information in its possession. Provided this Agreement was not
          terminated for Customer&apos;s breach, Customer may retain and use
          internally copies of all reports exported from any Service prior to
          termination. Customer acknowledges that following termination it will
          have no further access to any Customer Data input into any Service,
          and that Ship may delete any such data as may have been stored by Ship
          at any time. Except where an exclusive remedy is specified, the exercise
          of either party of any remedy under this Agreement, including termination,
          will be without prejudice to any other remedies it may have under this
          Agreement, by Law or otherwise.
        </p>

        <p>
          <span className={styles.chapter}>8.4. Survival.</span>
          The following Sections will survive any expiration or termination of
          this Agreement: 2.7 (General Restrictions), 2.9 (Trial Subscriptions),
          3.2 (Storage of Customer Data), 3.4 (Indemnification by Customer),
          3.5 (Aggregated Anonymous Data), 6 (Ownership), 7.2 (Fees and Payment),
          7.3 (Payment Via Credit Card), 8 (Term and Termination), 9.2 (Warranty
          Disclaimer), 13 (Limitation of Remedies and Damages), 14 (Indemnification),
          15 (Confidential Information) and 17 (General Terms).
        </p>

        <h2>9. LIMITED WARRANTY</h2>

        <p>
          <span className={styles.chapter}>9.1. Limited Warranty.</span>
          Ship warrants, for Customer&apos;s benefit only, that each Service will
          operate in substantial conformity with the applicable Documentation.
          Ship&apos;s sole liability (and Customer&apos;s sole and exclusive remedy)
          for any breach of this warranty will be, at no charge to Customer, for
          Ship to use commercially reasonable efforts to correct the reported
          non-conformity, or if Ship determines such remedy to be impracticable,
          either party may terminate the applicable Subscription Term and Customer
          will receive as its sole remedy a refund of any fees Customer has
          pre-paid for use of such Service for the terminated portion of the
          applicable Subscription Term. The limited warranty set forth in this
          Section 9.1 will not apply: (i) unless Customer makes a claim within
          thirty (30) days of the date on which Customer first noticed the
          non-conformity, (ii) if the error was caused by misuse, unauthorized
          modifications or third-party hardware, software or services, or (iii)
          to use provided on a no-charge, trial or evaluation basis.
        </p>

        <p>
          <span className={styles.chapter}>9.2. Warranty Disclaimer</span>
          EXCEPT FOR THE LIMITED WARRANTY IN SECTION 9.1, ALL SERVICES AND
          PROFESSIONAL SERVICES ARE PROVIDED &quot;AS IS&quot;. NEITHER SHIP NOR
          ITS SUPPLIERS MAKES ANY OTHER WARRANTIES, EXPRESS OR IMPLIED, STATUTORY
          OR OTHERWISE, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
          TITLE, FITNESS FOR A PARTICULAR PURPOSE OR NONINFRINGEMENT. SHIP DOES
          NOT WARRANT THAT CUSTOMER&apos;S USE OF THE SERVICES WILL BE
          UNINTERRUPTED OR ERROR-FREE, NOR DOES SHIP WARRANT THAT IT WILL REVIEW
          THE CUSTOMER DATA FOR ACCURACY OR THAT IT WILL PRESERVE OR MAINTAIN
          THE CUSTOMER DATA WITHOUT LOSS OR CORRUPTION. SHIP SHALL NOT BE LIABLE
          FOR THE RESULTS OF ANY COMMUNICATIONS SENT OR ANY COMMUNICATIONS THAT
          WERE FAILED TO BE SENT USING THE SERVICES. SHIP SHALL NOT BE LIABLE FOR
          DELAYS, INTERRUPTIONS, SERVICE FAILURES OR OTHER PROBLEMS INHERENT IN
          USE OF THE INTERNET AND ELECTRONIC COMMUNICATIONS, THIRD-PARTY PLATFORMS
          OR OTHER SYSTEMS OUTSIDE THE REASONABLE CONTROL OF SHIP. CUSTOMER MAY
          HAVE OTHER STATUTORY RIGHTS, BUT THE DURATION OF STATUTORILY REQUIRED
          WARRANTIES, IF ANY, SHALL BE LIMITED TO THE SHORTEST PERIOD PERMITTED
          BY LAW.
        </p>

        <h2>10. SUPPORT</h2>

        <p>
          During the Subscription Term of each Service, Ship will provide end
          user support.
        </p>

        <h2>11. PROFESSIONAL SERVICES</h2>

        <p>
          Ship will provide the professional consulting services (&quot;Professional
          Services&quot;) purchased in the applicable Order Form. The scope of
          Professional Services will be as set forth in a Statement of Work
          referencing this Agreement and executed by both parties describing the
          work to be performed, fees and any applicable milestones, dependencies
          and other technical specifications or related information (&quot;SOW&quot;).
          Unless Professional Services are provided on a fixed-fee basis, Customer
          will pay Ship at the per-hour rates set forth in the Order Form (or,
          if not specified, at Ship&apos;s then-standard rates) for any excess
          services. Customer will reimburse Ship for reasonable travel and lodging
          expenses as incurred. Customer may use anything delivered as part of
          the Professional Services in support of authorized use of the Services
          and subject to the terms regarding Customer&apos;s rights to use the
          Service set forth in Section 2 (Ship Services) and the applicable SOW,
          but Ship will retain all right, title and interest in and to any such
          work product, code or deliverables and any derivative, enhancement or
          modification thereof created by Ship (or its agents).
        </p>

        <h2>12. LIMITATION OF REMEDIES AND DAMAGES</h2>

        <p>
          <span className={styles.chapter}>
            12.1. Consequential Damages Waiver.
          </span>
          EXCEPT FOR EXCLUDED CLAIMS (DEFINED BELOW), NEITHER PARTY (NOR ITS
          SUPPLIERS) SHALL HAVE ANY LIABILITY ARISING OUT OF OR RELATED TO THIS
          AGREEMENT FOR ANY LOSS OF USE, LOST DATA, LOST PROFITS, FAILURE OF
          SECURITY MECHANISMS, INTERRUPTION OF BUSINESS, OR ANY INDIRECT, SPECIAL,
          INCIDENTAL, RELIANCE, OR CONSEQUENTIAL DAMAGES OF ANY KIND, EVEN IF
          INFORMED OF THE POSSIBILITY OF SUCH DAMAGES IN ADVANCE.
        </p>

        <p>
          <span className={styles.chapter}>12.2. Liability Cap.</span>
          SHIP&apos;S AND ITS SUPPLIERS&apos; ENTIRE LIABILITY TO CUSTOMER
          ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE
          AMOUNT ACTUALLY PAID BY CUSTOMER TO SHIP DURING THE PRIOR TWELVE (12)
          MONTHS UNDER THIS AGREEMENT.
        </p>

        <p>
          <span className={styles.chapter}>12.3. Excluded Claims.</span>
          &quot;Excluded Claims&quot; means any claim arising (a) from Customer&apos;s
          breach of Section 2.7 (General Restrictions); (b) under Section 3.3
          (Customer Obligations) or 3.4 (Indemnification by Customer); or (c)
          from a party&apos;s breach of its obligations in Section 14
          (Confidential Information) (but excluding claims arising from operation
          or non-operation of any Service).
        </p>

        <p>
          <span className={styles.chapter}>
            12.4. Nature of Claims and Failure of Essential Purpose.
          </span>
          The parties agree that the waivers and limitations specified in this
          Section 12 apply regardless of the form of action, whether in contact,
          tort (including negligence), strict liability or otherwise and will
          survive and apply even if any limited remedy specified in this
          Agreement is found to have failed of its essential purpose.
        </p>

        <h2>13. INDEMNIFICATION</h2>

        <p className={styles.alert}>
          Ship will defend Customer from and against any claim by a third party
          alleging that a Service when used as authorized under this Agreement
          infringes a U.S. patent, U.S. copyright, or U.S. trademark and will
          indemnify and hold harmless Customer from and against any damages and
          costs finally awarded against Customer or agreed in settlement by Ship
          (including reasonable attorneys&apos; fees) resulting from such claim,
          provided that Ship will have received from Customer: (i) prompt written
          notice of such claim (but in any event notice in sufficient time for
          Ship to respond without prejudice); (ii) the exclusive right to control
          and direct the investigation, defense and settlement (if applicable)
          of such claim; and (iii) all reasonable necessary cooperation of
          Customer. If Customer&apos;s use of a Service is (or in Ship&apos;s
          opinion is likely to be) enjoined, if required by settlement or if Ship
          determines such actions are reasonably necessary to avoid material
          liability, Ship may, in its sole discretion: (a) substitute substantially
          functionally similar products or services; (b) procure for Customer the
          right to continue using such Service; or if (a) and (b) are not
          commercially reasonable, (c) terminate this Agreement and refund to
          Customer the fees paid by Customer for the portion of the Subscription
          Term that was paid by Customer but not rendered by Ship. The foregoing
          indemnification obligation of Ship will not apply: (1) if such Service
          is modified by any party other than Ship, but solely to the extent the
          alleged infringement is caused by such modification; (2) if such Service
          is combined with products or processes not provided by Ship, but solely
          to the extent the alleged infringement is caused by such combination;
          (3)to any unauthorized use of such Service; (4) to any action arising
          as a result of Customer Data or any third-party deliverables or components
          contained within such Service; (5) to the extent the alleged infringement
          is not caused by the particular technology or implementation of the
          Service but instead by features common to any similar product or
          service; or (6) if Customer settles or makes any admissions with respect
          to a claim without Ship&apos;s prior written consent. THIS SECTION 14
          SETS FORTH Ship&apos;s AND ITS SUPPLIERS&apos; SOLE LIABILITY AND
          CUSTOMER&apos;S SOLE AND EXCLUSIVE REMEDY WITH RESPECT TO ANY CLAIM OF
          INTELLECTUAL PROPERTY INFRINGEMENT.
        </p>

        <h2>14. CONFIDENTIAL INFORMATION</h2>

        <p>
          Each party (as &quot;Receiving Party&quot;) agrees that all code,
          inventions, know-how, business, technical and financial information it
          obtains from the disclosing party (&quot;Disclosing Party&quot;)
          constitute the confidential property of the Disclosing Party
          (&quot;Confidential Information&quot;), provided that it is identified
          as confidential at the time of disclosure or should be reasonably known
          by the Receiving Party to be confidential or proprietary due to the
          nature of the information disclosed and the circumstances surrounding
          the disclosure. Any Ship Technology, performance information relating
          to any Service, and the terms and conditions of this Agreement will be
          deemed Confidential Information of Ship without any marking or further
          designation. Except as expressly authorized herein, the Receiving Party
          will (1) hold in confidence and not disclose any Confidential Information
          to third parties and (2) not use Confidential Information for any purpose
          other than fulfilling its obligations and exercising its rights under
          this Agreement. The Receiving Party may disclose Confidential Information
          to its employees, agents, contractors and other representatives having
          a legitimate need to know (including, for Ship, the subcontractors
          referenced in Section 16.8 (Subcontractors)), provided that such
          representatives are bound to confidentiality obligations no less
          protective of the Disclosing Party than this Section 14 and that the
          Receiving Party remains responsible for compliance by any such
          representative with the terms of this Section 14. The Receiving Party&apos;s
          confidentiality obligations will not apply to information that the
          Receiving Party can document: (i) was rightfully in its possession or
          known to it prior to receipt of the Confidential Information; (ii) is
          or has become public knowledge through no fault of the Receiving Party;
          (iii) is rightfully obtained by the Receiving Party from a third party
          without breach of any confidentiality obligation; or (iv) is independently
          developed by employees of the Receiving Party who had no access to such
          information. The Receiving Party may make disclosures to the extent
          required by Law or court order, provided the Receiving Party notifies
          the Disclosing Party in advance and cooperates in any effort to obtain
          confidential treatment. The Receiving Party acknowledges that disclosure
          of Confidential Information would cause substantial harm for which
          damages alone would not be a sufficient remedy, and therefore that
          upon any such disclosure by the Receiving Party the Disclosing Party
          will be entitled to seek appropriate equitable relief in addition to
          whatever other remedies it might have at Law.
        </p>

        <h2>15. GENERAL TERMS</h2>

        <p>
          <span className={styles.chapter}>15.1. Assignment.</span>
          This Agreement will bind and inure to the benefit of each party&apos;s
          permitted successors and assigns. Neither party may assign this Agreement
          without the advance written consent of the other party, except that
          either party may assign this Agreement in connection with a merger,
          reorganization, acquisition or other transfer of all or substantially
          all of such party&apos;s assets or voting securities. Any attempt to
          transfer or assign this Agreement except as expressly authorized under
          this Section 15.1 will be null and void.
        </p>

        <p>
          <span className={styles.chapter}>15.2. Severability.</span>
          If any provision of this Agreement will be adjudged by any court of
          competent jurisdiction to be unenforceable or invalid, that provision
          will be limited to the minimum extent necessary so that this Agreement
          will otherwise remain in effect.
        </p>

        <p>
          <span className={styles.chapter}>
            15.3. Governing Law; Dispute Resolution.
          </span>
        </p>

        <p>
          a)
          <span className={styles.listTitle}>
            Direct Dispute Resolution.
          </span>
          In the event of any dispute, claim, question, or disagreement arising
          from or relating to this Agreement, whether arising in contract, tort
          or otherwise, (&quot;Dispute&quot;), the parties shall first use their
          best efforts to resolve the Dispute. If a Dispute arises, the complaining
          party shall provide written notice to the other party in a document
          specifically entitled &quot;Initial Notice of Dispute&quot; specifically
          setting forth the precise nature of the dispute (&quot;Initial Notice
          of Dispute&quot;). If an Initial Notice of Dispute is being sent to Ship
          it must sent via mail to: Paralect LLC at 11-4 Kulman Street, Minsk
          220100 Belarus.
        </p>

        <p>
          Following receipt of the Initial Notice of Dispute, the parties shall
          consult and negotiate with each other in good faith and, recognizing
          their mutual interest, attempt to reach a just and equitable solution
          of the Dispute that is satisfactory to both parties (&quot;Direct Dispute
          Resolution&quot;). If the parties are unable to reach a resolution of
          the Dispute through Direct Dispute Resolution within thirty (30) days
          of the receipt of the Initial Notice of Dispute, then the Dispute shall
          subsequently be resolved by the arbitration as set forth below.
        </p>

        <p>
          b)
          <span className={styles.listTitle}>Arbitration.</span>
          IN THE EVENT THAT A DISPUTE BETWEEN THE PARTIES CANNOT BE SETTLED
          THROUGH DIRECT DISPUTE RESOLUTION, AS DESCRIBED ABOVE, THE PARTIES
          AGREE TO SUBMIT THE DISPUTE TO BINDING ARBITRATION. BY AGREEING TO
          ARBITRATE, THE PARTIES AGREE TO WAIVE THEIR RIGHT TO A JURY TRIAL.
          The arbitration shall be conducted before a single neutral arbitrator,
          before JAMS in San Francisco, California. The arbitration shall be
          administered by JAMS in accordance with this document and the JAMS
          Streamlined Rules and Procedures for the Arbitration, with one addition:
          The limitation of one discovery deposition per side shall be applied
          by the arbitrator, unless it is determined, based on all relevant
          circumstances, that more depositions are warranted. The arbitrator
          shall consider the amount in controversy, the complexity of the factual
          issues, the number of parties and the diversity of their interests and
          whether any or all of the claims appear, on the basis of the pleadings,
          to have sufficient merit to justify the time and expense associated
          with the requested discovery.
        </p>

        <p>
          The arbitration will occur in San Francisco, California, but the
          parties may choose to appear by person, by phone, by another virtual
          means, or through the submission of documents.
        </p>

        <p>
          The arbitrator will issue a ruling in writing. Any issue concerning the
          extent to which any dispute is subject to arbitration, the applicability,
          interpretation, or enforceability of this agreement shall be resolved
          by the arbitrator. To the extent state law is applicable, the arbitrator
          shall apply the substantive law of California.
        </p>

        <p>
          All aspects of the arbitration shall be treated as confidential and
          neither the parties nor the arbitrators may disclose the content or
          results of the arbitration, except as necessary to comply with legal
          or regulatory requirements. The result of the arbitration shall be
          binding on the parties and judgment on the arbitrator&apos;s award may
          be entered in any court having jurisdiction. The arbitrator shall award
          to the prevailing party, if any, the costs and attorneys&apos; fees
          reasonably incurred by the prevailing party in connection with the
          arbitration.
        </p>

        <p>
          c)
          <span className={styles.listTitle}>
            Choice of Law and Jurisdiction.
          </span>
          FOR ANY CLAIM WHICH IS NOT SUBJECT TO THIS DISPUTE RESOLUTION PROVISION,
          CUSTOMER AGREES TO SUBMIT AND CONSENT TO THE PERSONAL AND EXCLUSIVE
          JURISDICTION IN, AND THE EXCLUSIVE VENUE OF, THE STATE AND FEDERAL
          COURTS LOCATED WITHIN SAN FRANCISCO COUNTY, CALIFORNIA. IN ANY DISPUTE,
          CALIFORNIA LAW SHALL APPLY.
        </p>

        <p>
          d)
          <span className={styles.listTitle}>
            Construction and Joinder.
          </span>
          THIS AGREEMENT MUST BE CONSTRUED AS IF IT WAS JOINTLY WRITTEN BY BOTH
          PARTIES. BOTH CUSTOMER AND MAQPIE AGREE THAT EACH MAY BRING OR PARTICIPATE
          IN CLAIMS AGAINST THE OTHER ONLY IN THEIR RESPECTIVE INDIVIDUAL
          CAPACITIES, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS.
          NO ARBITRATION OR CLAIM UNDER THIS AGREEMENT SHALL BE JOINED TO ANY
          OTHER ARBITRATION OR CLAIM, INCLUDING ANY ARBITRATION OR CLAIM INVOLVING
          ANY OTHER CURRENT OR FORMER USER OF THE SERVICES, AND NO CLASS ARBITRATION
          PROCEEDINGS SHALL BE PERMITTED. IN THE EVENT OF ANY DISPUTE CONCERNING
          THE VALIDITY OR ENFORCEABILITY OF THIS PROVISION, SUCH CLAIM MUST BE
          ADJUDICATED BY A COURT AND NOT BY AN ARBITRATOR.
        </p>

        <p>
          e)
          <span className={styles.listTitle}>
            Injunctive Relief.
          </span>
          Notwithstanding the above provisions, Ship may apply for injunctive
          remedies (or an equivalent type of urgent legal relief) in any jurisdiction.
        </p>

        <p>
          <span className={styles.chapter}>15.4. Notice.</span>
          Any notice or communication required or permitted under this Agreement
          will be in writing to the parties at the addresses set forth on the
          Order Form or at such other address as may be given in writing by either
          party to the other in accordance with this Section and will be deemed
          to have been received by the addressee (i) if given by hand, immediately
          upon receipt; (ii) if given by overnight courier service, the first
          business day following dispatch or (iii) if given by registered or
          certified mail, postage prepaid and return receipt requested, the second
          business day after such notice is deposited in the mail.
        </p>

        <p>
          <span className={styles.chapter}>15.5. Amendments; Waivers.</span>
          Except as otherwise provided herein, no supplement, modification, or
          amendment of this Agreement will be binding, unless executed in writing
          by a duly authorized representative of each party to this Agreement.
          No waiver will be implied from conduct or failure to enforce or exercise
          rights under this Agreement, nor will any waiver be effective unless
          in a writing signed by a duly authorized representative on behalf of
          the party claimed to have waived. No provision of any purchase order
          or other business form employed by Customer will supersede the terms
          and conditions of this Agreement, and any such document relating to
          this Agreement will be for administrative purposes only and will have
          no legal effect.
        </p>

        <p>
          <span className={styles.chapter}>15.6. Entire Agreement.</span>
          This Agreement is the complete and exclusive statement of the mutual
          understanding of the parties and supersedes and cancels all previous
          written and oral agreements and communications relating to the subject
          matter of this Agreement. Customer acknowledges that the Services are
          on-line, subscription-based products, and that in order to provide
          improved customer experience Ship may make changes to the Services,
          and Ship will update the applicable Documentation accordingly.
        </p>

        <p>
          <span className={styles.chapter}>15.7. Force Majeure.</span>
          Neither party will be liable to the other for any delay or failure to
          perform any obligation under this Agreement (except for a failure to
          pay fees) if the delay or failure is due to unforeseen events that
          occur after the signing of this Agreement and that are beyond the
          reasonable control of such party, such as a strike, blockade, war, act
          of terrorism, riot, natural disaster, failure or diminishment of power
          or telecommunications or data networks or services, or refusal of a
          license by a government agency.
        </p>

        <p>
          <span className={styles.chapter}>15.8. Subcontractors.</span>
          Ship may use the services of subcontractors and permit them to exercise
          the rights granted to Ship in order to provide the Services under this
          Agreement, provided that Ship remains responsible for (i) compliance
          of any such subcontractor with the terms of this Agreement and (ii) for
          the overall performance of the Services as required under this Agreement.
        </p>

        <p>
          <span className={styles.chapter}>15.9. Mandatory Disclosure.</span>
          Nothing in this Agreement prevents Maqpie from disclosing Customer
          Data to the extent required by Laws, or court or government agencies&apos;
          orders, but Maqpie will use commercially reasonable efforts to notify
          Customer where permitted to do so.
        </p>

        <p>
          <span className={styles.chapter}>15.10. Independent Contractors.</span>
          The parties to this Agreement are independent contractors. There is no
          relationship of partnership, joint venture, employment, franchise or
          agency created hereby between the parties. Neither party will have the
          power to bind the other or incur obligations on the other party&apos;s
          behalf without the other party&apos;s prior written consent
        </p>

        <p>
          <span className={styles.chapter}>15.11. Export Control.</span>
          In its use of the Services, Customer agrees to comply with all export
          and import Laws and regulations of the United States and other
          applicable jurisdictions. Without limiting the foregoing, (i) Customer
          represents and warrants that it is not listed on any U.S. government
          list of prohibited or restricted parties or located in (or a national
          of) a country that is subject to a U.S. government embargo or that has
          been designated by the U.S. government as a &quot;terrorist supporting&quot;
          country, (ii) Customer will not (and will not permit any of its users
          to) access or use the Services in violation of any U.S. export embargo,
          prohibition or restriction, and (iii) Customer will not submit to the
          Services any information that is controlled under the U.S. International
          Traffic in Arms Regulations
        </p>

        <p>
          <span className={styles.chapter}>15.12. Government End-Users.</span>
          Elements of the Services are commercial computer software. If the user
          or licensee of the Services is an agency, department, or other entity
          of the United States Government, the use, duplication, reproduction,
          release, modification, disclosure, or transfer of the Services, or any
          related documentation of any kind, including technical data and manuals,
          is restricted by a license agreement or by the terms of this Agreement
          in accordance with Federal Acquisition Regulation 12.212 for civilian
          purposes and Defense Federal Acquisition Regulation Supplement 227.7202
          for military purposes. All Services were developed fully at private
          expense. All other use is prohibited
        </p>

        <p>
          <span className={styles.chapter}>15.13. Counterparts.</span>
          This Agreement may be executed in counterparts, each of which will be
          deemed an original and all of which together will be considered one
          and the same agreement. Maqpie may unilaterally sign the accounting
          source documents that are mandatory in accordance with applicable Laws.
        </p>
      </PrivacyLayout>
    );
  }
}
