"use client";

import React from "react"
import { tss } from "tss-react";
import { z } from "zod";
import _, { set } from "lodash";
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
import { toast } from "sonner";
import { RegisterFormSchema } from "@refineit/lib/definitions";
import { checkUsernameAvailibility, registerUser } from "@refineit/store/authentication";
import { http, sleep } from "@refineit/utilities";
import { signIn } from "next-auth/react";

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

type FormValues = z.infer<typeof RegisterFormSchema>;

export default function RegisterationForm() {
    const [loading, setLoading] = React.useState(false);
    const [signingIn, setSigningIn] = React.useState(false);
    const [buttonText, setButtonText] = React.useState("Create Account")
    const [usernameExists, setUsernameExists] = React.useState(false);
    const { classes } = useStyles();
    const { control, formState: { errors }, handleSubmit } = useForm<FormValues>({ resolver: zodResolver(RegisterFormSchema) });

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        setLoading(true);

        try {
            const response = await registerUser(formData);
            if (typeof response === "string") {
                throw new Error(response);
            }
            if (http.isHttpError(response) && response.statusCode > 400) {
                throw new Error(response.status.message);
            }
            
            setButtonText("Signing in...");
            setSigningIn(true);
            toast.success("Success", { description: "Account created successfully! Please wait while we sign you in..." });

            await sleep(400);
            
            await signIn("credentials", { username: formData.username, password: formData.password });
            
        } catch (error) {
            toast.error("Error occurred", { description: String(error) });
        }

        setLoading(false);
    }

    const handleChange = _.debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameExists(false);
        const name = event.target.value;
        let data = await checkUsernameAvailibility({ name });
        if (typeof data === "string") {
            return toast.error("Error occurred", { description: data });
        }

        if (http.isHttpError(data) && data.statusCode === 404) {
            setUsernameExists(false);
        } else if (!data.status.error) {
            setUsernameExists(true);
        }

        console.log("Username availability:", data);
    }, 500);


    return (
        <div className="card py-4">
            <div className="p-fluid">
                <div className="field mb-4">
                    <FloatLabel>
                        <Controller
                            name="fullname"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    className={classNames({ "p-invalid": errors["fullname"] })}
                                    id="fullname"
                                    {...field}
                                />
                            )}
                        />
                        <label htmlFor="fullname">Full Name</label>
                    </FloatLabel>
                    <FormFieldError errors={errors} field="fullname" />
                </div>
                <div className="field mb-4">
                    <FloatLabel>
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    className={classNames({ "p-invalid": errors["username"] || usernameExists})}
                                    id="username"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleChange(e);
                                    }}
                                />
                            )}
                        />
                        <label htmlFor="username">User Name</label>
                    </FloatLabel>
                    <FormFieldError errors={errors} field="username" />
                    {
                        usernameExists && (<div className="mt-1">
                            <small id="username-help" className="p-error mt-2">This username is already taken</small>
                        </div>)
                    }
                </div>
                <div className="field mb-4">
                    <FloatLabel>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    className={classNames({ "p-invalid": errors["email"] })}
                                    id="email"
                                    {...field}
                                />
                            )}
                        />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                    <FormFieldError errors={errors} field="email" />
                </div>
                <div className="field mb-4">
                    <FloatLabel>
                        <Controller
                            name="password"
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
                        <label className={errors["password"] ? classes.error : ""} htmlFor="password">Password</label>
                    </FloatLabel>
                    <FormFieldError errors={errors} field="password" />
                </div>
                <div className="field-checkbox mb-0">
                    <Controller
                        name="agreeTerms"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                {...field}
                                inputId="agreeTerms"
                                className="mr-2" checked={field.value}
                            />
                        )}
                    />
                    <label htmlFor="agreeTerms">I agree to the <a href="#" className="text-primary">Terms & Conditions</a></label>
                </div>
                <FormFieldError className="mb-4" errors={errors} field="agreeTerms" />
                <button className="mb-2 p-button-contrast p-button p-component" onClick={handleSubmit(onSubmit)} disabled={loading || signingIn}>
                    <span className="p-button-label p-c" data-pc-section="label">{loading ? <ProgressSpinner className={classes.loader} strokeWidth="8" /> : buttonText}</span>
                </button>
            </div>
            <Divider align="center" type="solid">
                <span className="text-600 font-normal text-sm">OR SIGN UP WITH</span>
            </Divider>
            <div className="flex justify-content-between mt-4">
                <Button label="Google" icon={<Image alt='' height={20} width={20} src="/images/google.svg" />} className="p-button-secondary p-button-outlined w-full mr-2" />
                <Button label="GitHub" icon={<Image alt='' height={20} width={20} src="/images/github.svg" />} className="p-button-secondary p-button-outlined w-full ml-2" />
            </div>
        </div>
    )
}