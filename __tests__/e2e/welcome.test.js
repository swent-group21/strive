describe('Welcome Navigation', () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    it('should show the first welcome screen on launch', async () => {
      await expect(element(by.id('welcomeIntro'))).toBeVisible();
      await expect(element(by.id('activeIndex')).toHaveText('0'));
      await expect(element(by.id('welcomeTitle'))).toBeVisible();  // Check for the title
      await expect(element(by.id('ovalShape'))).toBeVisible();     // Check for the oval background shape
      await expect(element(by.id('bottomContainer'))).toBeVisible();   // Check for the bottom container
      await expect(element(by.id('welcomeImage'))).toBeVisible();  // Check for the image
    });
  
    it('should swipe to the second welcome screen', async () => {
      await element(by.id('scrollView')).scroll(300, 'right');      
      await expect(element(by.id('welcomeConcept'))).toBeVisible();
      await expect(element(by.id('activeIndex')).toHaveText('1'));
      await expect(element(by.id('ovalShape2'))).toBeVisible();         // Check for the oval background
      await expect(element(by.id('textContainer2'))).toBeVisible();     // Check for the text container
      await expect(element(by.id('welcomeTitle2'))).toBeVisible();      // Check for the title
      await expect(element(by.id('welcomeDescription2'))).toBeVisible(); // Check for the description
    });
  
    it('should swipe to the third welcome screen', async () => {
        await element(by.id('scrollView')).scroll(300, 'right');  // Scroll to the right to reveal the third screen
        await expect(element(by.id('welcomePersonal'))).toBeVisible();
        await expect(element(by.id('ovalShape3'))).toBeVisible();         // Check for the oval background
        await expect(element(by.id('textContainer3'))).toBeVisible();     // Check for the text container
        await expect(element(by.id('welcomeTitle3'))).toBeVisible();      // Check for the title
        await expect(element(by.id('welcomeDescription3'))).toBeVisible();// Check for the description
    });
  
    it('should swipe to the fourth welcome screen', async () => {
        await element(by.id('scrollView')).scroll(300, 'right');  // Scroll to the right to reveal the fourth screen
        await expect(element(by.id('welcomeFinal'))).toBeVisible();
        await expect(element(by.id('ovalShapeOne4'))).toBeVisible();
        await expect(element(by.id('ovalShapeTwo4'))).toBeVisible();
        await expect(element(by.id('welcomeTitle4'))).toBeVisible();
        await expect(element(by.id('buttonContainer'))).toBeVisible();  // Check for button container
  });

  it('should display and test the buttons inside the button container', async () => {
    await expect(element(by.id('loginButton'))).toBeVisible();   // Check login button is visible
    await expect(element(by.id('signupButton'))).toBeVisible();  // Check signup button is visible
    await expect(element(by.id('guestButton'))).toBeVisible();   // Check guest button is visible
  });
  
    it('should navigate to signup screen after pressing login button', async () => {
        await element(by.id('signupButton')).tap();  // Tap the sign-up button
        await expect(element(by.id('signUpScreen'))).toBeVisible();  // Ensure the signup screen appears
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
  