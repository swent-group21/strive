describe('Sign Up Screen', () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    it('should display all components on the sign up screen', async () => {
      await expect(element(by.id('signUpScreen'))).toBeVisible();
      await expect(element(by.id('signUpBackgroundImage'))).toBeVisible();
      await expect(element(by.id('signUpScreenTitle'))).toBeVisible();
      await expect(element(by.id('signUpInputFields'))).toBeVisible();
      await expect(element(by.id('signUpNameInput'))).toBeVisible();
      await expect(element(by.id('signUpSurnameInput'))).toBeVisible();
      await expect(element(by.id('signUpEmailInput'))).toBeVisible();
      await expect(element(by.id('signUpPasswordInput'))).toBeVisible();
      await expect(element(by.id('signUpConfirmPasswordInput'))).toBeVisible();
      await expect(element(by.id('signUpStriveWithUsButton'))).toBeVisible();
    });
  
    it('should allow typing into input fields', async () => {
      await element(by.id('signUpNameInput')).tap();
      await element(by.id('signUpNameInput')).typeText('John');
  
      await element(by.id('signUpSurnameInput')).tap();
      await element(by.id('signUpSurnameInput')).typeText('Doe');
  
      await element(by.id('signUpEmailInput')).tap();
      await element(by.id('SignUpeEmailInput')).typeText('john.doe@example.com');
  
      await element(by.id('signUpPasswordInput')).tap();
      await element(by.id('signUpPasswordInput')).typeText('password123');
  
      await element(by.id('signUpConfirmPasswordInput')).tap();
      await element(by.id('signUpConfirmPasswordInput')).typeText('password123');
    });
  
    it('should navigate to the next screen after pressing "Strive with us" button', async () => {
      await element(by.id('striveWithUsButton')).tap();  // Tap the strive button
      await expect(element(by.id('nextScreen'))).toBeVisible();  // Ensure the next screen appears (adjust 'nextScreen' as needed)
    });
  });