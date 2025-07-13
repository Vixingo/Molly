import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <p>Hello World</p>
            <Link href="/dashboard">
                <Button>Click me</Button>
            </Link>
            <ModeToggle />
        </>
    );
}
