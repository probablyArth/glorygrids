import {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { MinusIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { deleteImage, storeImage } from "@/storage";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const fetchImageAsFile = async (url: string, fileName: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};

const QuestionsContext = createContext<{
  questions: string[];
  setQuestions: Dispatch<SetStateAction<string[]>>;
}>({
  questions: [],
  setQuestions: () => {
    console.log("hihi");
  },
});

const QuestionsContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<string[]>([
    "Who are you / what are you working on?",
    "How has [our product / service] helped you?",
  ]);
  return (
    <QuestionsContext.Provider value={{ questions, setQuestions }}>
      {children}
    </QuestionsContext.Provider>
  );
};

const WrappedNewGrid = () => {
  return (
    <QuestionsContextProvider>
      <NewGrid />
    </QuestionsContextProvider>
  );
};

const Question: FC<{ idx: number }> = ({ idx }) => {
  const { questions, setQuestions } = useContext(QuestionsContext);
  const { toast } = useToast();

  return (
    <div className="flex gap-4">
      <Input
        value={questions[idx]}
        onChange={(e) => {
          setQuestions((questions) => {
            const newQuestions = [...questions];
            newQuestions[idx] = e.target.value;
            return newQuestions;
          });
        }}
        required
        placeholder="Question"
      />
      <Button
        variant={"outline"}
        type="button"
        onClick={() => {
          setQuestions((questions) => {
            if (questions.length <= 1) {
              toast({
                title: "Atleast 1 question is required!",
              });
              return questions;
            }
            const newQuestions = [...questions];
            newQuestions.splice(idx, 1);
            return newQuestions;
          });
        }}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Questions = () => {
  const { toast } = useToast();

  const { questions, setQuestions } = useContext(QuestionsContext);

  return (
    <div className="flex flex-col gap-3">
      <FormLabel>Questions</FormLabel>
      <div className="flex flex-col gap-2">
        {questions.map((_, idx) => (
          <Question key={idx} idx={idx} />
        ))}
      </div>
      <Button
        variant={"ghost"}
        type="button"
        onClick={() => {
          setQuestions((questions) => {
            if (questions.length >= 5) {
              toast({
                title: "Can't add more than 5 questions!",
              });
              return questions;
            }
            return [...questions, ""];
          });
        }}
      >
        Add one
      </Button>
    </div>
  );
};

const NewGrid = () => {
  const { questions } = useContext(QuestionsContext);
  const submitMut = api.grids.post.useMutation();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    title: z
      .string()
      .min(3, { message: "Grid title must be atleast 3 characters." })
      .max(50, { message: "Grid title must be at most 50 characters." }),
    header: z
      .string()
      .min(3, { message: "Grid title must be atleast 3 characters." })
      .max(50, { message: "Grid title must be at most 50 characters." }),
    customMessage: z
      .string()
      .min(5, { message: "Custom message must be atleast 5 characters." })
      .max(100, { message: "Custom message must be at most 100 characters." }),
    questions: z
      .array(z.string())
      .min(1, {
        message: "Grid must have atleast 1 question.",
      })
      .max(5, { message: "Grid must have at most 5 questions." }),
    icon: z.instanceof(File),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.setValue("questions", questions);
  }, [questions, form]);

  const [iconLoading, setIconLoading] = useState(true);
  const [iconPreview, setIconPreview] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const file = await fetchImageAsFile("/gg.png", "gg.png");
        form.setValue("icon", file);
        setIconPreview(URL.createObjectURL(file));
      } catch (e) {
      } finally {
        setIconLoading(false);
      }
    })();
  }, [form]);

  const onSubmit = form.handleSubmit(async (data) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const fileData = await storeImage(data.icon);
      await submitMut
        .mutateAsync({
          title: data.title,
          header: data.header,
          customMessage: data.customMessage,
          questions: data.questions,
          iconStorageId: fileData.$id,
        })
        .catch(async (_) => {
          await deleteImage(fileData.$id);
          throw new Error("Failed to create grid.");
        });
      toast({
        title: "Created grid succesfully 🎉 ",
        variant: "default",
      });
      void router.push("/dashboard");
      form.reset();
    } catch (e) {
      toast({
        title: "Failed to create grid.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  });

  if (iconLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-[350px] self-center">
      <CardHeader>
        <CardTitle className="text-4xl font-bold tracking-tight">
          Create a new Grid
        </CardTitle>
        <Image
          src={iconPreview}
          className="h-[200px] w-[200px] rounded-full"
          height={200}
          width={200}
          alt="icon"
        />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grid Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} required />
                  </FormControl>
                  <FormDescription>
                    Give your grid a title that describes its purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="header"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grid Header</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} required />
                  </FormControl>
                  <FormDescription>
                    This will be displayed to the user.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Message</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This message will be displayed to the user when receiving a
                    testimonial.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({}) => (
                <FormItem>
                  <FormLabel>Grid Icon</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        const file = e.target.files?.item(0) as unknown as File;
                        form.setValue("icon", file);
                        setIconPreview(URL.createObjectURL(file));
                      }}
                      type="file"
                      accept="image/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Questions />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Create
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WrappedNewGrid;
