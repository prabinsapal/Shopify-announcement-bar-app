import { Page } from "@shopify/polaris";


export default function PlanPage() {
    // Graphql to request subscription
    // mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $test: Boolean!, $trialDays: Int!) {
    //     appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, test: $test, trialDays: $trialDays) {
    //       userErrors {
    //         field
    //         message
    //       }
    //       appSubscription {
    //         id
    //       }
    //       confirmationUrl
    //     }
    //   }

    // This is variables for AppSubscriptionCreate
    // {
    //     "name": "Basic",
    //     "returnUrl": "http://super-duper.shopifyapps.com/",
    //     "test": true,
    //     "trialDays": 0,
    //     "lineItems": [
    //       {
    //         "plan": {
    //           "appRecurringPricingDetails": {
    //             "price": {
    //               "amount": 5,
    //               "currencyCode": "USD"
    //             },
    //             "interval": "EVERY_30_DAYS"
    //           }
    //         }
    //       }
    //     ]
    //   }

    // Graphql to fetch Subscription data
    // query appInstallation{
    //     appInstallation {
    //       activeSubscriptions {
    //         id
    //         name
    //         returnUrl
    //         test
    //         trialDays
    //         createdAt
    //         status
    //         currentPeriodEnd
    //         lineItems {
    //           plan {
    //             pricingDetails{
    //               ... on AppRecurringPricing{
    //                 __typename
    //                 interval
    //                 price {
    //                   amount
    //                   currencyCode
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }

    // Graphql to cancel Subscription
    // mutation AppSubscriptionCancel($id: ID!, $prorate: Boolean) {
    //     appSubscriptionCancel(id: $id, prorate: $prorate) {
    //       userErrors {
    //         field
    //         message
    //       }
    //       appSubscription {
    //         id
    //         status
    //       }
    //     }
    //   }

    // This is variables for AppSubscriptionCancel
    // {
    //     "id": "gid://shopify/AppSubscription/23940923488", // this is app subscription id
    //     "prorate": true
    //   }

    <Page title="Plan">
        Plan Page
    </Page>
}