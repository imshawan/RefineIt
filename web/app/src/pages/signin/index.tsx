import React, { useState } from 'react';
import { tss } from 'tss-react';
import { z } from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { FloatLabel } from 'primereact/floatlabel';
import { classNames } from 'primereact/utils'
import { FormFieldError } from '../../components';
import { useAuthentication } from '../../hooks/authentication';
import { Toast } from 'primereact/toast';

const schema = z.object({
    email: z.string().nonempty({ message: "Username or email is required" }).min(3, { message: "Enter a valid username or email" }),
    password: z.string().nonempty({ message: "Password is required" }).min(5, { message: "Password must be at least 5 characters" })
});

const useStyles = tss.create(() => ({
    container: {
        minHeight: "100vh",
    },
    leftInnerContainer: {
        backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    backdrop: {
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(55, 55, 55, 0.5)'
    },
    link: {
        textDecoration: "none",
        color: "var(--text-color)"
    },
    passwordError: {
        '& input': {
            borderColor: "#e24c4c"
        },
    },
    error: {
        color: "#e24c4c"
    }
}));

type FormValues = z.infer<typeof schema>;

export const SignIn: React.FC = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const { signIn } = useAuthentication();
    const { classes } = useStyles();
    const { control, formState: { errors }, handleSubmit } = useForm<FormValues>({ resolver: zodResolver(schema) });
    const toast = React.useRef<Toast | null>(null);

    const success = () => {
        toast.current?.show({ severity: "success", summary: "Success", detail: "Signed in successfully!", life: 3000 });
    }

    const failure = (message: string) => {
        toast.current?.show({ severity: "error", summary: "Error", detail: message, life: 3000 });
    }

    const onSubmit: SubmitHandler<FormValues> = (formData) => {
        let {email: Username, password: Password} = formData;
        let formValues = {Username, Password}

        signIn({formValues, success, failure})
    }

    return (
        <div className={"flex flex-wrap " + classes.container}>
            <div className={"hidden md:block md:w-6 lg:w-7 bg-primary " + classes.leftInnerContainer}>
                <div className={"h-full p-4 " + classes.backdrop}>
                    <div className="flex flex-column justify-content-center h-full">
                        <h2 className="text-5xl font-bold text-white mb-4">Transform Code Reviews</h2>
                        <p className="text-white line-height-3 mb-4">
                            Make informed decisions with Refine.It's powerful collaboration tools.
                            Harness the power of peer reviews to drive your development forward.
                        </p>
                        <ul className="list-none p-0 m-0 text-white">
                            <li className="flex align-items-center mb-3">
                                <i className="pi pi-check-circle mr-2"></i>
                                <span>Streamline code review process</span>
                            </li>
                            <li className="flex align-items-center mb-3">
                                <i className="pi pi-check-circle mr-2"></i>
                                <span>Foster team collaboration</span>
                            </li>
                            <li className="flex align-items-center">
                                <i className="pi pi-check-circle mr-2"></i>
                                <span>Improve code quality</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-6 lg:w-5 flex flex-column justify-content-between pb-3">
                <div className="p-4 pt-6 md:pt-5 sm:px-8 md:px-5 lg:px-4 xl:px-8">
                    <div className="text-center mb-5">
                        <i className="pi pi-code text-5xl text-primary"></i>
                        <h2 className="text-3xl font-bold mb-1 mt-3">Welcome Back to Refine.It</h2>
                        <p className="mt-0">Enter your credentials to continue.</p>
                    </div>
                    <div className="card py-4">
                        <div className="p-fluid">
                            <div className="field mb-4">
                                <FloatLabel>
                                    <Controller
                                        name={"email"}
                                        control={control}
                                        render={({ field }) => (
                                            <InputText
                                                className={classNames({ 'p-invalid': errors["email"] })}
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
                                                className={`${errors.password?.message ? classes.passwordError : ''}`}
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
                                    <Checkbox inputId="rememberme" className="mr-2" checked={rememberMe} onChange={(e) => setRememberMe(Boolean(e.checked))} />
                                    <label htmlFor="rememberme">Remember me</label>
                                </div>
                                <div className="text-center">
                                    <a href="#" className={"hover:text-green-600 " + classes.link}>Forgot password?</a>
                                </div>
                            </div>
                            <Button label="Sign In" onClick={handleSubmit(onSubmit)} className="mb-2 p-button-contrast" />
                        </div>
                        <Divider align="center" type="solid">
                            <span className="text-600 font-normal text-sm">OR SIGN IN WITH</span>
                        </Divider>
                        <div className="flex justify-content-between mt-4">
                            <Button label="Google" icon={<img height={20} src="/images/google.svg" />} className="p-button-secondary p-button-outlined w-full mr-2" />
                            <Button label="GitHub" icon={<img height={20} src="/images/github.svg" />} className="p-button-secondary p-button-outlined w-full ml-2" />
                        </div>
                    </div>
                    <div className="text-center">
                        <span>Don't have an account? </span>
                        <a href="#" className={"font-medium hover:text-green-600 " + classes.link}>Register</a>
                    </div>
                </div>
                <div className="flex justify-content-between px-4 sm:px-8 md:px-5 lg:px-4 xl:px-8">
                    <div className="text-center font-normal text-xs">
                        <span>&copy;</span> 2024 Refine.It. All rights reserved
                    </div>
                    <div className="font-semibold text-xs text-center">
                        <a href="#" className={"hover:text-green-600 " + classes.link}>Privacy Policy</a>
                        <span className="mx-2">•</span>
                        <a href="#" className={"hover:text-green-600 " + classes.link}>Terms & Conditions</a>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
};