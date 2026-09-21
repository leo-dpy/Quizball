@extends('base')

@section('content')
<h1>Les sports</h1>

@if (session('status'))
    <div class="alert alert-success">{{ session('status') }}</div>
@endif

<table class="table">
    <thead>
        <tr>
            <th>Identifiant</th>
            <th>Nom</th>
            <th>Couleur</th>
            <th>Questions</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($categories as $categorie)
            <tr>
                <td>{{ $categorie->slug }}</td>
                <td>{{ $categorie->nom }}</td>
                <td>{{ $categorie->couleur }}</td>
                <td>{{ $categorie->questions_count }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endsection
