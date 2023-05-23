const readline = require('readline');

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask a question and get user input
function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  }); 
}

// Main async function
async function main() {
  // Product catalog
  const products = [
    { name: 'Product A', price: 20 },
    { name: 'Product B', price: 40 },
    { name: 'Product C', price: 50 }
  ];

  console.log('--- Product Catalog ---');
  for (const product of products) {
    console.log(`${product.name} \t$${product.price}`);
  }
  console.log()

  // Cart items
  const cartItems = {};

  // Ask quantity and gift wrap for each product
  for (const product of products) {   // for each product, since ' in ' takes only key  'of ' is used
    const productName = product.name;
    const productPrice = product.price;

    // Ask quantity
    const quantity = parseInt(await askQuestion(`Enter quantity for ${productName}: `));
    cartItems[productName] = {
      quantity,
      isGift: false
    };

    // Ask gift wrap
    const isGiftWrap = await askQuestion(`Wrap ${productName} as a gift? (yes/no): `);
    if (isGiftWrap.toLowerCase() === 'yes') {
      cartItems[productName].isGift = true;
    }
    console.log()

  }
  // Calculate total amount
  let subtotal = 0;
  let totalQuantity = 0;
  let discountAmount = 0;
  let discountName = '';
  let shippingFee = 0;
  let giftWrapFee = 0;
  let maxQuantity=0;
  let maxDiscount=0
  

  for (const product in cartItems) {
    const { quantity, isGift } = cartItems[product];
    const price = products.find(p => p.name === product).price;//finds the product along with details and then takes its price into account
    const productTotal = price * quantity;

    subtotal += productTotal;
    totalQuantity += quantity;

    if (quantity > maxQuantity) {
        maxQuantity = quantity;
      }

    if (quantity > 10) {
      const discount1 = (productTotal * 5) / 100;
      if (discount1 > maxDiscount) {
        discountAmount = discount1;
        discountName = 'bulk_5_discount';
      }
    }

    if (isGift) {
      giftWrapFee += quantity;
    }
  }

  //Other discount rules
  if (subtotal > 200) {
        const discount2=(subtotal * 10) / 100;
        if (discount2 >discountAmount) {
                discountAmount = (subtotal * 10) / 100;
                discountName = 'flat_10_discount';
        }    
  }

  if (totalQuantity > 20) {
        const discount3 = (subtotal * 10) / 100;
        if (discount3 > discountAmount) {
          discountAmount = discount3;
          discountName = 'bulk_10_discount';
        }
      }


      for(const product in cartItems){
        if (totalQuantity > 30 && maxQuantity > 15)  {
                const itemPrice = products.find(p => p.name===product).price;        
                const discountedQuantity = Math.max(cartItems[product].quantity - 15, 0);
                const discount4 = (itemPrice * discountedQuantity * 50) / 100;
                if (discount4 > discountAmount) {
                        discountAmount = discount4;
                        discountName = 'tiered_50_discount';
                }    
        }
      }


  // Calculate shipping fee
  const totalPackages = Math.ceil(totalQuantity / 10);
  shippingFee = totalPackages * 5;

  // Calculate total
  const total = subtotal - discountAmount + shippingFee + giftWrapFee;

  // Output the details
  console.log('--- Order Details ---');
  for (const product in cartItems) {
    const { quantity } = cartItems[product];
    const price = products.find(p => p.name === product).price;
    const productTotal = price * quantity;
    console.log(`${product}: Quantity: ${quantity}, Total: $${productTotal}`);
  }
  console.log();
  console.log('Subtotal:', subtotal);
  console.log('Discount applied:', discountName);
  console.log('Discount Amount:', discountAmount);
  console.log('Shipping Fee:', shippingFee);
  console.log('Gift Wrap Fee:', giftWrapFee);
  console.log('Total:', total);

  // Close the readline interface
  rl.close();
}

// Call the main function
main();
