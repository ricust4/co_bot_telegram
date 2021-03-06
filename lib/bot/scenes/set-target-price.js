'use strict';
const WizardScene = require('telegraf/scenes/wizard');
const { Product } = require('../../models');

const steps = [
  async ctx => {
    const productId = ctx.wizard.state.productId;
    const product = await Product.findById(productId);

    await ctx.editMessageText('Ingrese su precio objetivo para' + product.name + ' (Si coloca 0 se eliminarĂ¡)');

    ctx.wizard.next();
  },
  async ctx => {
    const productId = ctx.wizard.state.productId;
    const targetPrice = ctx.update.message.text;

    const product = await Product.findByIdAndUpdate(productId, { 'preferences.targetPrice': targetPrice });

    if (targetPrice !== '0') {
      const currency = product.currency || '';

      await ctx.reply('El precio indicado ' + product.name + ' estaba configurado para ' + targetPrice + currency + '.');
    } else {
      await ctx.reply('El precio indicado ' + product.name + ' se ha eliminado.');
    }

    await ctx.scene.leave();
  }
];

module.exports = new WizardScene('set-target-price', ...steps);
