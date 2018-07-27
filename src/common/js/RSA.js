import Cookies from './cookie'
import { BigInt, biFromHex, biHighIndex, biToHex, biToString, setMaxDigits } from './BigInt'
import { BarrettMu } from './Barrett'

export var key

function RSAKeyPair (encryptionExponent, decryptionExponent, modulus) {
  this.e = biFromHex(encryptionExponent)
  this.d = biFromHex(decryptionExponent)
  this.m = biFromHex(modulus)
  // We can do two bytes per digit, so
  // chunkSize = 2 * (number of digits in modulus - 1).
  // Since biHighIndex returns the high index, not the number of digits, 1 has
  // already been subtracted.
  this.chunkSize = 2 * biHighIndex(this.m)
  this.radix = 16
  this.barrett = new BarrettMu(this.m)
}

export function encryptedString (key, s) {
  // Altered by Rob Saunders (rob@robsaunders.net). New routine pads the
  // string after it has been converted to an array. This fixes an
  // incompatibility with Flash MX's ActionScript.
  var a = []
  var sl = s.length
  var i = 0
  while (i < sl) {
    a[i] = s.charCodeAt(i)
    i++
  }

  while (a.length % key.chunkSize !== 0) {
    a[i++] = 0
  }

  var al = a.length
  var result = ''
  var j, k, block
  for (i = 0; i < al; i += key.chunkSize) {
    block = new BigInt()
    j = 0
    for (k = i; k < i + key.chunkSize; ++j) {
      block.digits[j] = a[k++]
      block.digits[j] += a[k++] << 8
    }
    var crypt = key.barrett.powMod(block, key.e)
    var text = key.radix === 16 ? biToHex(crypt) : biToString(crypt, key.radix)
    result += text + ' '
  }
  return result.substring(0, result.length - 1) // Remove last space.
}

export function bodyRSA () {
  var RSAKeySize = Cookies.getValue('RSAKeySize')
  // 1024位的Key，应该设置setMaxDigits(130)；如果是2048位的则应该设置为260
  if (RSAKeySize === 2048 || RSAKeySize === '2048') {
    setMaxDigits(260)
  } else {
    setMaxDigits(130)
  }
  key = new RSAKeyPair(Cookies.getValue('publicKeyEmpoent'), '', Cookies.getValue('publicKeyModule'))
}
