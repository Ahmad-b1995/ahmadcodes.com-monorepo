import Image from "next/image";
import { FC } from "react";

const Hero: FC = () => {
    return (
        <div className="w-full flex items-center justify-center mt-5">
            <div className="w-full flex gap-8">
                <div className="w-1/3">
                    <Image
                        src="/images/profilePic.jpg"
                        alt="Ahmad Bagheri"
                        className="w-full h-auto rounded-full border-2 border-gray-300"
                        width={250}
                        height={250}
                    />
                </div>
                <div className="w-2/3 ">
                    <h1 className="text-4xl font-bold text-gray-500">Ahmad Bagheri</h1>
                    <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                        This is a brief summary about yourself. You can include details
                        like your current job, skills, or anything else that represents
                        you.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Hero;