import { TestimonialType } from "@/type/testimonials";
import React, {
  createContext,
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";

type InboxContextType = {
  currentInbox: TestimonialType;
  setCurrentInbox: Dispatch<SetStateAction<TestimonialType>>;
  slug: string;
};

const InboxContext = createContext<InboxContextType>({
  currentInbox: TestimonialType.All,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentInbox: () => {},
  slug: "",
});

export const useInboxContext = () => useContext(InboxContext);

const InboxContextProvider: FC<{ children: ReactNode; slug: string }> = ({
  children,
  slug,
}) => {
  const [currentInbox, setCurrentInbox] = useState<TestimonialType>(
    TestimonialType.All,
  );

  return (
    <InboxContext.Provider value={{ currentInbox, setCurrentInbox, slug }}>
      {children}
    </InboxContext.Provider>
  );
};

export default InboxContextProvider;
