import React, { useState } from 'react';

const SubscriptionCheck = ({onCompleted, step}) => {
  const [zipcode, setZipcode] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const validZipcodes = ['10001', '10002', '10003', '10004', '10005'];
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const [isLoading, setIsLoading] = useState(false);

  // Validates user input and sets error messages
  const validate = (id, value, checkAll = false) => {
    const newErrors = checkAll ? {} : { ...errors };

    if (checkAll || id === "zipcode") {
      const currentZipcode = id === "zipcode" ? value : zipcode;
      if (!currentZipcode) {
        newErrors.zipcode = window.sultans.Strings.subscription.validate.zipcodeIsRequired;
      } else if (!validZipcodes.includes(currentZipcode)) {
        newErrors.zipcode = window.sultans.Strings.subscription.validate.zipcodeIsNotValid;
      } else if (!checkAll) {
        delete newErrors.zipcode;
      }
    }

    if (checkAll || id === "email") {
      const currentEmail = id === "email" ? value : email;
      if (!currentEmail) {
        newErrors.email = window.sultans.Strings.subscription.validate.emailIsRequired;
      } else if (!emailRegex.test(currentEmail)) {
        newErrors.email = window.sultans.Strings.subscription.validate.enterValidEmail;
      } else if (!checkAll) {
        delete newErrors.email;
      }
    }

    return newErrors;
  };

  // Handles form submission, performs validation, and triggers onCompleted if successful.
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formErrors = validate(null, null, true);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setErrors({});
        setIsLoading(false);

        onCompleted({
          step: step.id,
          email: email,
          zipcode: zipcode
        });
      }, 2000);
    }
  };

  // Updates the state for zipcode and email inputs and clears specific errors as the user types.
  const handleChange = (event) => {
    const { id, value } = event.target;

    if (id === 'zipcode') {
      setZipcode(value);
    } else if (id === 'email') {
      setEmail(value);
    }

    const fieldErrors = validate(id, value);
    setErrors(fieldErrors);
  };

  return (
    <div className="subscription-check">
      <div className="subscription-check__container">
        <h2 className="subscription__title">{window.sultans.Strings.subscription.availability.title}</h2>
        <p className="subscription__description">{window.sultans.Strings.subscription.availability.description}</p>
        <form className="subscription-check__form" onSubmit={handleSubmit}>
          <div className="subscription-check__box">
            <label className="subscription-check__label" htmlFor="zipcode">{window.sultans.Strings.subscription.availability.zipCode}</label>
            <input
              className="subscription-check__input"
              type="text"
              id="zipcode"
              value={zipcode}
              onChange={handleChange}
              placeholder={window.sultans.Strings.subscription.availability.zipCodePlaceholder}
              disabled={isLoading}
            />
            {errors.zipcode && <div className="error">{errors.zipcode}</div>}
          </div>

          <div className="subscription-check__box">
            <label className="subscription-check__label" htmlFor="email">{window.sultans.Strings.subscription.availability.email}</label>
            <input
              className="subscription-check__input"
              type="text"
              id="email"
              value={email}
              onChange={handleChange}
              placeholder={window.sultans.Strings.subscription.availability.emailPlaceholder}
              disabled={isLoading}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <button className="subscription__button" type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="fading">{window.sultans.Strings.subscription.availability.checkButton}</span>
              </>
            ) : (
              <span>{window.sultans.Strings.subscription.availability.confirmButton}</span>
            )}
          </button>
        </form>
        <p className="subscription-check__terms">{window.sultans.Strings.subscription.availability.terms}</p>
      </div>
    </div>
  );
};

export default SubscriptionCheck;
