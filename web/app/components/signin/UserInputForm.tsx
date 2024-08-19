"use client";

import React from "react"
import { tss } from "tss-react";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { FloatLabel } from "primereact/floatlabel";
import { classNames } from "primereact/utils"
import { FormFieldError } from "@refineit/components";
import { ProgressSpinner } from "primereact/progressspinner";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SigninFormSchema } from "@refineit/lib/definitions";

const useStyles = tss.create(() => ({
    link: {
        textDecoration: "none",
        color: "var(--text-color)"
    },
    passwordError: {
        "& input": {
            borderColor: "#e24c4c"
        },
    },
    error: {
        color: "#e24c4c"
    },
    loader: {
        width: "1rem", 
        height: "1rem"
    }
}));

type FormValues = z.infer<typeof SigninFormSchema>;

export default function UserInputForm() {
    const [loading, setLoading] = React.useState(false);
    const { classes } = useStyles();
    const router = useRouter();
    const { control, formState: { errors }, handleSubmit } = useForm<FormValues>({ resolver: zodResolver(SigninFormSchema) });

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        let { email: Username, password: Password, rememberMe: RememberMe } = formData;
        let formValues = { Username, Password, RememberMe };

        setLoading(true);

        const result = await signIn("credentials", {
            redirect: false,
            ...formValues
        });

        if (!result?.ok) {
            toast.error("Error occured", {description: String(result?.error)});
        } else {
            router.push("/")
            toast.success("Success", {description: "Successfully logged in"})
        }

        setLoading(false);
    }

    return (
        <div className="card py-4">
            <div className="p-fluid">
                <div className="field mb-4">
                    <FloatLabel>
                        <Controller
                            name={"email"}
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    className={classNames({ "p-invalid": errors["email"] })}
                                    id="emailorusername"
                                    {...field}
                                />
                            )}
                        />
                        <label htmlFor="emailorusername">Email or username</label>
                    </FloatLabel>
                    <FormFieldError errors={errors} field="email" />
                </div>
                <div className="field mb-4">
                    <FloatLabel>
                        <Controller
                            name={"password"}
                            control={control}
                            render={({ field }) => (
                                <Password
                                    className={`${errors.password?.message ? classes.passwordError : ""}`}
                                    id="password"
                                    {...field}
                                    feedback={true} toggleMask
                                />
                            )}
                        />
                        <label className={errors["password"] ? classes.error : ""} htmlFor="password">Enter Password</label>
                    </FloatLabel>
                    <FormFieldError errors={errors} field="password" />
                </div>
                <div className="field-checkbox mb-4 justify-content-between">
                    <div className="">
                        <Controller
                            name={"rememberMe"}
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="rememberMe"
                                    {...field}
                                    inputId="rememberme" className="mr-2" checked={Boolean(field.value)}
                                />
                            )}
                        />
                        <label htmlFor="rememberme">Remember me</label>
                    </div>
                    <div className="text-center">
                        <a href="#" className={"hover:text-green-600 " + classes.link}>Forgot password?</a>
                    </div>
                </div>
                <button className="mb-2 p-button-contrast p-button p-component" onClick={handleSubmit(onSubmit)} disabled={loading}>
                    <span className="p-button-label p-c" data-pc-section="label">{loading ? <ProgressSpinner className={classes.loader} strokeWidth="8" /> : "Sign In"}</span>
                </button>
            </div>
            <Divider align="center" type="solid">
                <span className="text-600 font-normal text-sm">OR SIGN IN WITH</span>
            </Divider>
            <div className="flex justify-content-between mt-4">
                <Button label="Google" icon={<Image alt='' height={20} width={20} src="/images/google.svg" />} className="p-button-secondary p-button-outlined w-full mr-2" />
                <Button label="GitHub" icon={<Image alt='' height={20} width={20} src="/images/github.svg" />} className="p-button-secondary p-button-outlined w-full ml-2" />
            </div>
        </div>
    )
}