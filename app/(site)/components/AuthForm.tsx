'use client';

import axios from "axios";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from 'react-icons/bs';

import { toast } from "react-hot-toast"

import { signIn, useSession } from "next-auth/react";

import { useRouter } from "next/navigation";




type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    //authentifiziert Nutzer
    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/users')
        }
    }), [session?.status, router]

    const toggleVariant = useCallback(() => {

        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }

    }, [variant]);


    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if(variant === 'REGISTER') {

            axios.post("/api/register", data)
            .then(() => signIn('credentials',data))
            .catch(() => toast.error("Etwas ist schiefgelaufen!"))
            .finally(() => setIsLoading(false))

        } if (variant === 'LOGIN') {
            signIn('credentials', {
                ...data,
                redirect: false
            })
            .then((callback) => {
                if(callback?.error) {
                    toast.error('Ungültige Anmeldedaten ');
                }

                if(callback?.ok && !callback.error){
                    toast.success('Eingeloggt')
                    router.push('/users');
                }
            })
            .finally(() => setIsLoading(false))
            
        } 
    }

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, { redirect: false })
        .then((callback) => {
        if(callback?.error){
        toast.error('Ungültige Anmeldedaten')
        }
        if(callback?.ok && !callback?.error) {
            toast.success("Erfolgreich eingeloggt")
        }
    })
    .finally(() => setIsLoading(false))
    }

    

    return (
        <div className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md">
            <div className="
            bg-white
            px-4
            py-8
            shadow
            sm:rounded-lg
            sm:px-10">
                <form className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}>

                    {/* Nur wenn der Benutzer sich registrieren will, namen angeben
                    
                        Seite Standardmäßig auf Login =>

                    */}
                    { variant === 'REGISTER' && (
                        <Input id="name" label="Name" 
                        register={register} 
                        errors={errors}
                        disabled={isLoading}></Input>
                    )}

                        {/* Will der Benutzer sich einloggen dann nur über Email =>*/}
                        
                        <Input id="email" label="Email-Adresse" 
                        register={register} 
                        errors={errors}
                        disabled={isLoading}></Input>

                        <Input id="password" label="Passwort" 
                        type="password"
                        register={register} 
                        errors={errors}
                        disabled={isLoading}></Input>

                        <div>
                            <Button
                            disabled={isLoading}
                            fullWidth
                            type="submit"> 
                                { variant === 'LOGIN' ? 'Einloggen' : 'Registrieren'}
                            </Button>
                        </div>

                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="
                        absolute
                        inset-0
                        flex
                        item-center">
                            <div className="w-full border-t border-gray-300"/>
                        </div>
                        <div className="relative
                                        flex 
                                        justify-center 
                                        text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Oder melde dich an mit:
                            </span>

                        </div>
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                        icon={BsGithub}
                        onClick={() => socialAction('github')}/>

                        <AuthSocialButton
                        icon={BsGoogle}
                        onClick={() => socialAction('google')}/>

                    </div>
                </div>

                <div className="
                flex
                gap-2
                justify-center
                text-sm
                mt-6
                px-2
                text-gray-500">

                    <div>
                        { variant === 'LOGIN' ? 'Neu hier?' : 'Ich habe bereits einen Account'}
                    </div>
                    <div
                    onClick={toggleVariant}
                    className="underline cursor-pointer">

                        {variant === 'LOGIN' ? 'Einen Account erstellen' : 'Zum Login'}

                    </div>

                </div>
            
            </div>
            
        </div>
    );

}

export default AuthForm;
 