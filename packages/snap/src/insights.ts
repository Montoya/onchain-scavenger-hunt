import { isObject, hasProperty } from '@metamask/utils';
import { getProgress, saveProgress } from './progress';

// A static class refactor of https://stackoverflow.com/a/60467595/786389.
class MD5 {
  private static readonly alphabet = '0123456789abcdef';

  public static hash(str?: string): string {
    if (typeof str !== 'string') {
      console.warn('coercing non-string value to empty string');
      str = '';
    }

    const x = MD5.sb(str);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let lastA;
    let lastB;
    let lastC;
    let lastD;
    for (let i = 0; i < x.length; i += 16) {
      lastA = a;
      lastB = b;
      lastC = c;
      lastD = d;

      a = MD5.ff(a, b, c, d, x[i], 7, -680876936);
      d = MD5.ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = MD5.ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = MD5.ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = MD5.ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = MD5.ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = MD5.ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = MD5.ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = MD5.ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = MD5.ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = MD5.ff(c, d, a, b, x[i + 10], 17, -42063);
      b = MD5.ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = MD5.ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = MD5.ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = MD5.ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = MD5.ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = MD5.gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = MD5.gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = MD5.gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = MD5.gg(b, c, d, a, x[i], 20, -373897302);
      a = MD5.gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = MD5.gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = MD5.gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = MD5.gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = MD5.gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = MD5.gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = MD5.gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = MD5.gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = MD5.gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = MD5.gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = MD5.gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = MD5.gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = MD5.hh(a, b, c, d, x[i + 5], 4, -378558);
      d = MD5.hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = MD5.hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = MD5.hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = MD5.hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = MD5.hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = MD5.hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = MD5.hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = MD5.hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = MD5.hh(d, a, b, c, x[i], 11, -358537222);
      c = MD5.hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = MD5.hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = MD5.hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = MD5.hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = MD5.hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = MD5.hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = MD5.ii(a, b, c, d, x[i], 6, -198630844);
      d = MD5.ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = MD5.ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = MD5.ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = MD5.ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = MD5.ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = MD5.ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = MD5.ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = MD5.ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = MD5.ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = MD5.ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = MD5.ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = MD5.ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = MD5.ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = MD5.ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = MD5.ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = MD5.ad(a, lastA);
      b = MD5.ad(b, lastB);
      c = MD5.ad(c, lastC);
      d = MD5.ad(d, lastD);
    }

    return MD5.rh(a) + MD5.rh(b) + MD5.rh(c) + MD5.rh(d);
  }

  private static rh(n: number): string {
    let s = '';
    for (let j = 0; j <= 3; j++) {
      s += MD5.alphabet.charAt((n >> (j * 8 + 4)) & 0x0F) + MD5.alphabet.charAt((n >> (j * 8)) & 0x0F);
    }

    return s;
  }

  private static ad(x: number, y: number): number {
    const l = (x & 0xFFFF) + (y & 0xFFFF);
    const m = (x >> 16) + (y >> 16) + (l >> 16);

    return (m << 16) | (l & 0xFFFF);
  }

  private static rl(n: number, c: number): number {
    return (n << c) | (n >>> (32 - c));
  }

  private static cm(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return MD5.ad(MD5.rl(MD5.ad(MD5.ad(a, q), MD5.ad(x, t)), s), b);
  }

  private static ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return MD5.cm(b & c | ~b & d, a, b, x, s, t);
  }

  private static gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return MD5.cm(b & d | c & ~d, a, b, x, s, t);
  }

  private static hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return MD5.cm(b ^ c ^ d, a, b, x, s, t);
  }

  private static ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return MD5.cm(c ^ (b | ~d), a, b, x, s, t);
  }

  private static sb(x: string): number[] {
    let i;
    const numBlocks = ((x.length + 8) >> 6) + 1;

    const blocks = new Array(numBlocks * 16);
    for (i = 0; i < numBlocks * 16; i++) {
      blocks[i] = 0;
    }

    for (i = 0; i < x.length; i++) {
      blocks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
    }

    blocks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blocks[numBlocks * 16 - 2] = x.length * 8;

    return blocks;
  }
}

/**
 * As an example, get transaction insights by looking at the transaction data
 * and attempting to decode it.
 *
 * @param transaction - The transaction to get insights for.
 * @returns The transaction insights.
 */
export async function getInsights(transaction: Record<string, unknown>) {

  const hexChainId = await wallet.request({ method: 'eth_chainId' });
  const chainId = parseInt(`${hexChainId}`, 16);

  const returnObject: Record<string, any> = {};

  try {
    // Check if the transaction has data.
    if (
      !isObject(transaction) ||
      !hasProperty(transaction, 'data') ||
      typeof transaction.to !== 'string'
    ) {
      throw 'Transaction data received is not an object.';
    } else if (chainId !== 1) {
      throw 'Not on Ethereum mainnet.';
    }

    let progress = await getProgress(); 
    const md5Hash = MD5.hash(transaction.to); 

    switch(md5Hash) { 
      case '30c3b99fd70723bd39961b53c1aa5f58': 
        if(progress["key1"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key1"] = true; 
        }
        break; 
      case '09e22a469996e6539dacdaeb35492436': 
        if(progress["key2"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key2"] = true; 
        }
        break; 
      case '57dc502a9b44c330fb02712390689a53':
        if(progress["key3"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key3"] = true; 
        }
        break; 
      case '6697df804202087952a959ec2bc2c9e5':
        if(progress["key4"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key4"] = true; 
        }
        break; 
      case 'f5e56d375e87701b1b5cc63d5935e6ac':
        if(progress["key5"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key5"] = true; 
        }
        break; 
      case '13cd37a35f339cfd92e5fec1bf5903c9':
        if(progress["key6"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key6"] = true; 
        }
        break; 
      case '4276ee3177debe2b5a020f22bbb6a406':
        if(progress["key7"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key7"] = true; 
        }
        break; 
      case 'a433a466ffa1e215f6e5d5c37a0b4785':
        if(progress["key8"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key8"] = true; 
        }
        break; 
      case '9cfa790b460bd652f975a0ee33d85745':
        if(progress["key9"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key9"] = true; 
        }
        break; 
      case 'fc2659f50cce5941f7bc109b6b7afe72': 
        if(progress["key10"]) { 
          returnObject["Already found"] = "You've been down this way before, adventurer."; 
        }
        else { 
          returnObject["Congratulations"] = "You have unlocked one of the items on your scavenger hunt."; 
          progress["key10"] = true; 
        }
        break; 
      default: 
        returnObject["Sorry, weary adventurer"] = "But an adventurer does not rest until the journey is complete."; 
        break; 
    }
    saveProgress(progress); 
  }
  catch (error) { 
    console.log(`Adventurer error: ${error}`); 
    returnObject["Not all who wander are lost"] = "But you might not be looking in the right place..."; 
  }

  return returnObject; 

}