import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-paypal-button',
  template: `<div id="paypal-button-container"></div>`,
  styles: [`
    #paypal-button-container {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }
  `]
})
export class PaypalButtonComponent implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.renderPayPalButton();
  }

  private renderPayPalButton(): void {
    // Ensure PayPal SDK is loaded before rendering the button
    if (window['paypal']) {
      window['paypal'].HostedButtons({
        hostedButtonId: "UZWE4CB7J9THA",
      }).render(this.el.nativeElement.querySelector('#paypal-button-container'));
    } else {
      console.error('PayPal SDK not loaded');
    }
  }
}
