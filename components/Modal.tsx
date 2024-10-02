"use client"

import { Description, Dialog, DialogPanel, DialogTitle , Transition} from '@headlessui/react'
import { useState , Fragment} from 'react';
import Image from 'next/image';
import { FormEvent } from 'react';
import { addUserEmailToProduct } from '@lib/actions';


interface Props {
    productId : string
}

const Modal = ({productId} : Props) => {

    let [isOpen, setIsOpen] = useState(false)

    const [isSubmitting , setIsSubmitting] = useState(false)
    const [email , setEmail] = useState("");

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        //add user email to product

        await addUserEmailToProduct(productId , email);

        closeModal();
        setIsSubmitting(false);
        setEmail('');

    }

    const openModal = () => setIsOpen(true);

    const closeModal = () => setIsOpen(false);


  return (
    <>
        <button type="button" onClick={openModal} className='btn'>
            Track
        </button>

        <Transition appear show={isOpen} as={Fragment}>

            <Dialog open={isOpen} onClose={closeModal} className="dialogue-container">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                    {/* <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                    <Description>This will permanently deactivate your account</Description>
                    <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                    <div className="flex gap-4">
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={closeModal}>Deactivate</button>
                    </div> */}
                    <div className="dialog-content">
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <div className="p-3 border border-gray-200">
                                    <Image 
                                        src="/assets/icons/logo.svg" 
                                        alt="logo"
                                        width={28}
                                        height={28}    
                                    />
                                </div>

                                <Image
                                    src="/assets/icons/x-close.svg"
                                    alt="close"
                                    width={24}
                                    height={24}
                                    className='cursor-pointer'
                                    onClick={closeModal}
                                ></Image>
                            </div>

                            <h4 className='dialog-head_text'>
                                Stay updated with product pricing alerts right in your inbox!
                            </h4>

                            <p className='text-sm text-gray-600 mt-2'>
                                Never miss a bargain again with out timely alerts!
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className='flex flex-col mt-5'>
                            <label htmlFor="email" className='text-sm font-medium text-gray-700'>
                                Email address
                            </label>
                            <div className="dialog-input_container">
                                <Image 
                                src="/assets/icons/mail.svg"
                                alt="mail"
                                width={18}
                                height={18}
                                ></Image>

                                <input 
                                type="text" 
                                id="email" 
                                required 
                                onChange={(e)=> setEmail(e.target.value)}
                                placeholder="Enter your email address" 
                                className="dialog-input"/>
                            </div>

                            <button className="dialog-btn" type="submit">
                               {isSubmitting ? "submitting..." : "Track"}
                            </button>
                        </form>
                    </div>
                </DialogPanel>
                </div>

            </Dialog>
        </Transition>

    </>
  )
}

export default Modal