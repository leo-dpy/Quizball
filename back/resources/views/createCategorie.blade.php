@extends('base')

@section('content')
<h1>Ajouter un sport</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $erreur)
                <li>{{ $erreur }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="{{ route('storecategorie') }}">
    @csrf
    <div class="form-group">
        <label for="slug">Identifiant (ex : foot)</label>
        <input type="text" class="form-control" name="slug" id="slug" value="{{ old('slug') }}">
    </div>
    <div class="form-group">
        <label for="nom">Nom affiché (ex : Football)</label>
        <input type="text" class="form-control" name="nom" id="nom" value="{{ old('nom') }}">
    </div>
    <div class="form-group">
        <label for="couleur">Couleur (ex : #01C187)</label>
        <input type="text" class="form-control" name="couleur" id="couleur" value="{{ old('couleur', '#01C187') }}">
    </div>
    <div class="form-group mt-3">
        <button type="submit" class="btn btn-primary">Ajouter</button>
    </div>
</form>
@endsection
