import Link from 'next/link'
export default function Page(){
    return(
        <div className={"p-8 pt-20 w-full flex flex-col items-center gap-4"}>
            <h1 className={"font-light text-3xl"}>Исследование не найдено</h1>
            <Link href={'/'} className={"underline"}>На главную</Link>
        </div>
    )
}