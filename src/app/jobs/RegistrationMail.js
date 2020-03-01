import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, order } = data;
    console.log('A fila executou');
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Cadastro de encomenda',
      template: 'registration',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        product: order.product,
      },
    });
  }
}

export default new RegistrationMail();
