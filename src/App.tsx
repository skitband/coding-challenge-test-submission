import React from "react";
import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import transformAddress, { RawAddressModel } from "./core/models/address";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const [postCode, setPostCode] = React.useState("");
  const [houseNumber, setHouseNumber] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */
  const handlePostCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPostCode(e.target.value);

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setHouseNumber(e.target.value);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value);

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value);

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    // Validation for postcode and house number
    if (!postCode.trim() || !houseNumber.trim()) {
      setError("Post code and house number are required!");
      return;
    }
    setAddresses([]);
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "";
      const url = `${baseUrl}/api/getAddresses?postcode=${encodeURIComponent(postCode)}&streetnumber=${encodeURIComponent(houseNumber)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      const details: RawAddressModel[] = Array.isArray(data.details) ? data.details : [];
      const transformed = details.map(addr => transformAddress({ ...addr, houseNumber }));
      setAddresses(transformed);
    } catch (err: any) {
      setError("Could not fetch addresses. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation for first and last name
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }
    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }
    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );
    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }
    addAddress({ ...foundAddress, firstName, lastName });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
  <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={handlePostCodeChange}
                placeholder="Post Code"
                value={postCode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={handleHouseNumberChange}
                value={houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit" loading={loading}>Find</Button>
          </fieldset>
        </form>
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleFirstNameChange}
                  value={firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleLastNameChange}
                  value={lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <div className="error">{error}</div>}

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setPostCode("");
            setHouseNumber("");
            setFirstName("");
            setLastName("");
            setSelectedAddress("");
            setAddresses([]);
            setError(undefined);
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
