import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AddressState {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
}
interface State {
  address: AddressState;

  // Methods
  setAddress: (address: AddressState) => void;
}

export const useAddressStore = create<State>()(
  persist(
    (set) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
      },

      // Methods
      setAddress: (address: AddressState) => {
        set({ address });
      },
    }),
    {
      name: "address-storage",
    }
  )
);
