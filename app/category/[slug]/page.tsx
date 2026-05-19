export default function Category({params}:{params:{slug:string}}){return <main className='container py-10'><h1 className='text-3xl font-bold'>Category: {params.slug.replaceAll('-',' ')}</h1></main>}
