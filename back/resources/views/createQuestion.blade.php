@extends('base')

@section('content')
<h1>Ajouter une question</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $erreur)
                <li>{{ $erreur }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="{{ route('storequestion') }}">
    @csrf
    <div class="form-group">
        <label for="categorie_id">Sport</label>
        <select class="form-control" name="categorie_id" id="categorie_id">
            @foreach ($categories as $categorie)
                <option value="{{ $categorie->id }}">{{ $categorie->nom }}</option>
            @endforeach
        </select>
    </div>
    <div class="form-group">
        <label for="difficulte">Difficulté</label>
        <select class="form-control" name="difficulte" id="difficulte">
            @foreach ($difficultes as $difficulte)
                <option value="{{ $difficulte }}">{{ ucfirst($difficulte) }}</option>
            @endforeach
        </select>
    </div>
    <div class="form-group">
        <label for="question">Question</label>
        <input type="text" class="form-control" name="question" id="question" value="{{ old('question') }}">
    </div>
    <div class="form-group">
        <label for="bonne_reponse">Bonne réponse</label>
        <input type="text" class="form-control" name="bonne_reponse" id="bonne_reponse" value="{{ old('bonne_reponse') }}">
    </div>
    <div class="form-group">
        <label for="mauvaise_1">Mauvaise réponse 1</label>
        <input type="text" class="form-control" name="mauvaise_1" id="mauvaise_1" value="{{ old('mauvaise_1') }}">
    </div>
    <div class="form-group">
        <label for="mauvaise_2">Mauvaise réponse 2</label>
        <input type="text" class="form-control" name="mauvaise_2" id="mauvaise_2" value="{{ old('mauvaise_2') }}">
    </div>
    <div class="form-group">
        <label for="mauvaise_3">Mauvaise réponse 3</label>
        <input type="text" class="form-control" name="mauvaise_3" id="mauvaise_3" value="{{ old('mauvaise_3') }}">
    </div>
    <div class="form-group mt-3">
        <button type="submit" class="btn btn-primary">Ajouter</button>
    </div>
</form>
@endsection
