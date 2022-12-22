import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snap-types';
import { getInsights } from './insights';
import { getProgress, resetProgress } from './progress';

/**
 * Handle an incoming transaction, and return any insights.
 *
 * @param args - The request handler args as object.
 * @param args.transaction - The transaction object.
 * @returns The transaction insights.
 */
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  return {
    insights: await getInsights(transaction),
  };
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async (args) => {
  switch (args.request?.method) {
    case 'progress':
      return await getProgress(); 
    case 'status': case 'hello': 
      const progress = await getProgress(); 
      let count = 0; 
      const total = 10; 
      for(var i = 1; i <= total; i++) { 
        if(progress[`key${i}`]) { 
          count++; 
        }
      }
      const params = { 
        prompt: 'Greetings, adventurer!', 
        description: 'Here is your progress.', 
        textAreaContent: `You have found ${count} of ${total} items on your scavenger hunt.`
      }; 
      if(count >= total) { 
        params.prompt = 'Congratulations!'; 
        params.description = 'You have completed your quest.'; 
        params.textAreaContent = `I honor you, brave adventurer, with this beautiful fox medal:

🟦🟦🟧🟦🟦🟦🟦🟧🟦🟦
🟦🟦🟧🟧🟦🟦🟧🟧🟦🟦
🟦🟦🟧⬜🟧🟧⬜🟧🟦🟦
🟦🟦🟧🟧🟧🟧🟧🟧🟦🟦
🟦🟧🟧⬛🟧🟧⬛🟧🟧🟦
🟦🟧🟧⬛🟧🟧⬛🟧🟧🟦
🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧
🟦🟧🟧🟧⬛⬛🟧🟧🟧🟦
🟦🟦🟦🟧🟧🟧🟧🟦🟦🟦
`; 
      }
      return wallet.request({
        method: 'snap_confirm',
        params: [
          params,
        ],
      });
    case 'reset': 
      const decision = await wallet.request({ 
        method: 'snap_confirm', 
        params: [
          { 
            prompt: 'Start over?', 
            description: 'If you do this, your progress will be reset.', 
            textAreaContent: 'Click APPROVE to clear your progress and start over.',
          }
        ], 
      }); 
      if(decision) { 
        await resetProgress(); 
      }
      return decision; 
    default:
      throw new Error('Method not found.');
  }
};
