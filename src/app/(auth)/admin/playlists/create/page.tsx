import CreatePlaylistForm from "../_components/create-playlist";

export default function CreatePlaylist() {
  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Criar playlist</h1>
      </header>

      <CreatePlaylistForm />
    </>
  );
}
